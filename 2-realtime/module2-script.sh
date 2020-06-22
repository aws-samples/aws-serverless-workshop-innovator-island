###########MODULE 2-Realtime
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"

COGNITO_POOLID=$(aws cognito-identity list-identity-pools  --max-results 10 | grep -B 1 ThemeParkIdentityPool | grep IdentityPoolId | cut -d'"' -f 4)
IOT_ENDPOINT_HOST=$(aws iot describe-endpoint --endpoint-type iot:Data-ATS | grep endpointAddress | cut -d'"' -f 4)
DDB_TABLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id DynamoDBTable --query "StackResourceDetail.PhysicalResourceId" --output text)

##Create Ridetimes Lambda Function and subscribe to SNS Topic
cd ~/environment/theme-park-backend/2-realtime/
zip 2-realtime-app.zip app.js
LAMBDA_ROLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ThemeParkLambdaRole --query "StackResourceDetail.PhysicalResourceId" --output text)
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name $LAMBDA_ROLE | grep Arn | cut -d'"' -f 4)

aws lambda create-function \
    --function-name theme-park-ridetimes \
    --runtime nodejs12.x \
    --zip-file fileb://2-realtime-app.zip \
    --handler app.handler \
    --role $LAMBDA_ROLE_ARN \
	--environment "Variables={DDB_TABLE_NAME=$DDB_TABLE,IOT_DATA_ENDPOINT=$IOT_ENDPOINT_HOST,IOT_TOPIC=theme-park-rides}"
	
LAMBDA_RIDE_ARN=$(aws lambda get-function --function-name theme-park-ridetimes | grep FunctionArn | cut -d'"' -f 4)
TOPIC_ARN=$(aws sns list-topics | grep theme-park-ride-times | grep Arn | cut -d'"' -f 4)
aws lambda add-permission --function-name theme-park-ridetimes --action lambda:InvokeFunction --statement-id sns-to-lambda --principal sns.amazonaws.com --source-arn $TOPIC_ARN
aws sns subscribe --protocol lambda --topic-arn $TOPIC_ARN --notification-endpoint $LAMBDA_RIDE_ARN

##Update FrontEnd
sed -i "s@poolId: ''@poolId: '$COGNITO_POOLID'@g" ~/environment/theme-park-frontend/src/config.js
sed -i "s@host: ''@host: '$IOT_ENDPOINT_HOST'@g" ~/environment/theme-park-frontend/src/config.js
sed -i "s@region: ''@region: '$AWS_REGION'@g" ~/environment/theme-park-frontend/src/config.js

cd ~/environment/theme-park-frontend/
git commit -am "Module 2"
git push
