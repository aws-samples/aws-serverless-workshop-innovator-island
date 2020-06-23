##Creating the PostProcess Lambda function
cd ~/environment/theme-park-backend/3-photos/3-postprocess/
zip 3-photos-3-postprocess.zip app.js
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
LAMBDA_ROLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ThemeParkLambdaRole --query "StackResourceDetail.PhysicalResourceId" --output text)
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name $LAMBDA_ROLE | grep Arn | cut -d'"' -f 4)
DDB_TABLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id DynamoDBTable --query "StackResourceDetail.PhysicalResourceId" --output text)
IOT_ENDPOINT_HOST=$(aws iot describe-endpoint --endpoint-type iot:Data-ATS | grep endpointAddress | cut -d'"' -f 4)
FINAL_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id FinalBucket --query "StackResourceDetail.PhysicalResourceId" --output text)

aws lambda create-function \
    --function-name theme-park-photos-postprocess   \
    --runtime nodejs12.x \
    --zip-file fileb://3-photos-3-postprocess.zip \
    --handler app.handler \
    --role $LAMBDA_ROLE_ARN \
	--environment "Variables={DDB_TABLE_NAME=$DDB_TABLE,IOT_DATA_ENDPOINT=$IOT_ENDPOINT_HOST}"

##Adding the S3 trigger

aws lambda add-permission --function-name theme-park-photos-postprocess --action lambda:InvokeFunction --statement-id s3-to-lambda-postprocess --principal s3.amazonaws.com --source-arn "arn:aws:s3:::$FINAL_BUCKET" --source-account $accountId

POSTPROCESS_FUNCTION_ARN=$(aws lambda get-function --function-name theme-park-photos-postprocess | grep FunctionArn | cut -d'"' -f 4)
POSTPROCESS_NOTIFICATION_CONFIGURATION='{"LambdaFunctionConfigurations":[{"Id":"theme-park-photos-postprocess-event","LambdaFunctionArn":"'$POSTPROCESS_FUNCTION_ARN'","Events": ["s3:ObjectCreated:*"]}]}'
aws s3api put-bucket-notification-configuration --bucket $FINAL_BUCKET --notification-configuration "$POSTPROCESS_NOTIFICATION_CONFIGURATION"

##Update frontend
PHOTO_UPLOAD_URL=$(aws cloudformation describe-stacks --stack-name theme-park-backend --query "Stacks[0].Outputs[?OutputKey=='UploadApi'].OutputValue" --output text)
sed -i "s@photoUploadURL: ''@photoUploadURL: '$PHOTO_UPLOAD_URL'@g" ~/environment/theme-park-frontend/src/config.js
cd ~/environment/theme-park-frontend/
git commit -am "Module 3 - Photo compositing"
git push
