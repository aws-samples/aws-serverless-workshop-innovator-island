AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
FINAL_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id FinalBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
PROCESSING_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ProcessingBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
UPLOAD_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id UploadBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"

##Create the Lambda function using SAM
cd ~/environment/theme-park-backend/3-photos/2-compositing
sam build
sam package --output-template-file packaged.yaml --s3-bucket $s3_deploy_bucket
sam deploy --template-file packaged.yaml --stack-name theme-park-photos --capabilities CAPABILITY_IAM --parameter-overrides "FinalBucketName"=$FINAL_BUCKET

##Adding the S3 trigger

COMPOSITE_FUNCTION=$(aws cloudformation describe-stack-resource --stack-name theme-park-photos --logical-resource-id CompositeFunction --query "StackResourceDetail.PhysicalResourceId" --output text)

aws lambda add-permission --function-name $COMPOSITE_FUNCTION --action lambda:InvokeFunction --statement-id s3-to-lambda-composite --principal s3.amazonaws.com --source-arn "arn:aws:s3:::$PROCESSING_BUCKET" --source-account $accountId

COMPOSITE_FUNCTION_ARN=$(aws lambda get-function --function-name $COMPOSITE_FUNCTION | grep FunctionArn | cut -d'"' -f 4)
PROCESSING_NOTIFICATION_CONFIGURATION='{"LambdaFunctionConfigurations":[{"Id":"'$COMPOSITE_FUNCTION'-event","LambdaFunctionArn":"'$COMPOSITE_FUNCTION_ARN'","Events": ["s3:ObjectCreated:*"]}]}'
aws s3api put-bucket-notification-configuration --bucket $PROCESSING_BUCKET --notification-configuration "$PROCESSING_NOTIFICATION_CONFIGURATION"

## Test Upload
cd ~/environment/theme-park-backend/3-photos/
aws s3 cp ./green-screen-test.png s3://$UPLOAD_BUCKET

