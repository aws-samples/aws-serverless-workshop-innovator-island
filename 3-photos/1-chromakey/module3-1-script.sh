#!/bin/sh
###########MODULE 3-Photos Chromakey
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
FINAL_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id FinalBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
PROCESSING_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ProcessingBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
UPLOAD_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id UploadBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"

mkdir ~/environment/lambda-layer
cd ~/environment/lambda-layer

wget https://innovator-island.s3.us-west-2.amazonaws.com/opencv-python-311.zip

aws s3 cp opencv-python-311.zip s3://$s3_deploy_bucket

aws lambda publish-layer-version --layer-name python-opencv-311 --description "OpenCV for Python 3.11" --content S3Bucket=$s3_deploy_bucket,S3Key=opencv-python-311.zip --compatible-runtimes python3.11

# ##Creating the Chromakey Lambda function
cd ~/environment/theme-park-backend/3-photos/1-chromakey/
zip 3-photos-1-chromakey.zip app.py
LAMBDA_ROLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ThemeParkLambdaRole --query "StackResourceDetail.PhysicalResourceId" --output text)
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name $LAMBDA_ROLE | grep Arn | cut -d'"' -f 4)
LAYER_ARN=$(aws lambda list-layers --query "Layers[?LayerName=='python-opencv-311'].{LayerArn: LatestMatchingVersion.LayerVersionArn}" --output json | jq -r '.[0].LayerArn')

CHROMAKEY_FUNCTION_NAME="theme-park-photos-chromakey"
aws lambda create-function \
    --function-name $CHROMAKEY_FUNCTION_NAME  \
    --runtime python3.11 \
    --zip-file fileb://3-photos-1-chromakey.zip \
    --handler app.lambda_handler \
    --role $LAMBDA_ROLE_ARN \
	--memory-size 3008 \
	--timeout 10 \
	--environment "Variables={OUTPUT_BUCKET_NAME=$PROCESSING_BUCKET,HSV_LOWER='[36, 100, 100]',HSV_UPPER='[70 ,255, 255]'}" \
	--layers $LAYER_ARN

# Check if the function was created successfully
if [ $? -eq 0 ]; then
    echo "$CHROMAKEY_FUNCTION_NAME created successfully."
else
    echo "Failed to create $CHROMAKEY_FUNCTION_NAME function."
    exit 1
fi

# Wait for the function to be fully created (up to a timeout)
TIMEOUT=120  # Timeout in seconds
INTERVAL=5   # Interval between checks in seconds
ELAPSED=0
ACTIVE="Active"

while [ $ELAPSED -lt $TIMEOUT ]; do
    CHROMAKEY_FUNCTION_STATUS=$(aws lambda get-function --region $AWS_REGION --function-name $CHROMAKEY_FUNCTION_NAME --query 'Configuration.State' --output text)
      echo "CHROMAKEY_FUNCTION_STATUS is" $CHROMAKEY_FUNCTION_STATUS
    if [ "$CHROMAKEY_FUNCTION_STATUS" = "$ACTIVE" ]; then
      echo "Adding the S3 trigger"
        aws lambda add-permission --function-name $CHROMAKEY_FUNCTION_NAME --action lambda:InvokeFunction --statement-id s3-to-lambda-chromakey --principal s3.amazonaws.com --source-arn "arn:aws:s3:::$UPLOAD_BUCKET" --source-account $accountId
       CHROMAKEY_FUNCTION_ARN=$(aws lambda get-function --function-name $CHROMAKEY_FUNCTION_NAME | grep FunctionArn | cut -d'"' -f 4)
       UPLOAD_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id UploadBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
       CHROMAKEY_NOTIFICATION_CONFIGURATION='{"LambdaFunctionConfigurations":[{"Id":"'$CHROMAKEY_FUNCTION_NAME'-event","LambdaFunctionArn":"'$CHROMAKEY_FUNCTION_ARN'","Events": ["s3:ObjectCreated:*"]}]}'
       CHROMAKEY_FUNCTION_ARN=$(aws lambda get-function --function-name $CHROMAKEY_FUNCTION_NAME | grep FunctionArn | cut -d'"' -f 4)
       aws s3api put-bucket-notification-configuration --bucket $UPLOAD_BUCKET --notification-configuration "$CHROMAKEY_NOTIFICATION_CONFIGURATION"
       ## Test Upload
       cd ~/environment/theme-park-backend/3-photos/
       aws s3 cp ./green-screen-test.png s3://$UPLOAD_BUCKET
        break
    fi

    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "$CHROMAKEY_FUNCTION_STATUS" != "Active" ]; then
    echo "Timeout: $CHROMAKEY_FUNCTION_NAME function didn't become active within $TIMEOUT seconds."
fi


