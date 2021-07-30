##############Module 1b-app-deploy

##Deploy the backend infrastructure
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"
echo $s3_deploy_bucket
aws s3 mb s3://$s3_deploy_bucket

##Deploy ride controller
cd ~/environment/theme-park-backend/1-app-deploy/ride-controller/
sam package --output-template-file packaged.yaml --s3-bucket $s3_deploy_bucket
sam deploy --template-file packaged.yaml --stack-name theme-park-ride-times --capabilities CAPABILITY_IAM

##Deploy remaining SAM backend 
cd ~/environment/theme-park-backend/1-app-deploy/sam-app/
sam build
sam package --output-template-file packaged.yaml --s3-bucket $s3_deploy_bucket
sam deploy --template-file packaged.yaml --stack-name theme-park-backend --capabilities CAPABILITY_IAM
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
FINAL_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id FinalBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
PROCESSING_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ProcessingBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
UPLOAD_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id UploadBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
DDB_TABLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id DynamoDBTable --query "StackResourceDetail.PhysicalResourceId" --output text)
echo $FINAL_BUCKET
echo $PROCESSING_BUCKET
echo $UPLOAD_BUCKET
echo $DDB_TABLE

##Populate the DynamoDB Table
cd ~/environment/theme-park-backend/1-app-deploy/local-app/
npm install
node ./importData.js $AWS_REGION $DDB_TABLE
aws dynamodb scan --table-name $DDB_TABLE
aws cloudformation describe-stacks --stack-name theme-park-backend --query "Stacks[0].Outputs[?OutputKey=='InitStateApi'].OutputValue" --output text

##Update frontend
INITSTATEAPI=$(aws cloudformation describe-stacks --stack-name theme-park-backend --query "Stacks[0].Outputs[?OutputKey=='InitStateApi'].OutputValue" --output text)
sed -i "s@initStateAPI: ''@initStateAPI: '$INITSTATEAPI'@g" ~/environment/theme-park-frontend/src/config.js

cd ~/environment/theme-park-frontend/
git commit -am "Module 1"
git push
