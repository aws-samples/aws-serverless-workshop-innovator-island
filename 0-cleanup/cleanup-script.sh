#!/bin/bash
###########MODULE 0-Cleanup
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
FINAL_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id FinalBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
PROCESSING_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id ProcessingBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
UPLOAD_BUCKET=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id UploadBucket --query "StackResourceDetail.PhysicalResourceId" --output text)
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"

aws s3 rb "s3://${FINAL_BUCKET}" --force
aws s3 rb "s3://${PROCESSING_BUCKET}" --force
aws s3 rb "s3://${UPLOAD_BUCKET}" --force
aws s3 rb "s3://${s3_deploy_bucket}" --force
aws s3 rb "s3://theme-park-data-${accountId}-${AWS_REGION}" --force

prefix="theme-park"

# List all CloudFormation stacks
stacks=$(aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query "StackSummaries[?starts_with(StackName, '$prefix')].StackName" --output text)

# Loop through the stacks and delete them
for stack in $stacks; do
    aws cloudformation delete-stack --stack-name "$stack"
    echo "Deleting stack: $stack"
done


aws lambda delete-function --function-name theme-park-ridetimes
aws lambda delete-function --function-name theme-park-photos-chromakey
aws lambda delete-function --function-name theme-park-photos-postprocess

aws codecommit delete-repository --repository-name theme-park-frontend

#aws amplify delete-app --app-id "theme-park-frontend"

rm -rf ~/environment/lambda-layer
rm -rf ~/environment/theme-park-frontend
rm ~/environment/theme-park-backend/1-app-deploy/local-app/package-lock.json
rm -rf ~/environment/theme-park-backend/1-app-deploy/local-app/node_modules
rm ~/environment/theme-park-backend/2-realtime/package-lock.json
rm ~/environment/theme-park-backend/2-realtime/2-realtime-app.zip
rm ~/environment/theme-park-backend/3-photos/1-chromakey/3-photos-1-chromakey.zip
rm ~/environment/theme-park-backend/3-photos/3-postprocess/3-photos-3-postprocess.zip
rm ~/environment/theme-park-backend/4-translate/local-app/translations.json
rm ~/environment/theme-park-backend/4-translate/local-app/package-lock.json
rm -rf ~/environment/theme-park-backend/4-translate/local-app/node_modules

## Define the list of topic names
#TOPICS=(
#    "topic-name1"
#    "topic-name2"
#    "topic-name3"
#)
## Loop through each topic name and delete subscriptions
#for TOPIC in "${TOPICS[@]}"; do
#    TOPIC_ARN=$(aws sns list-topics --region $AWS_REGION | jq -r ".Topics[] | select(.TopicArn | contains(\"$TOPIC\")) | .TopicArn")
#    aws sns delete-topic --region $AWS_REGION --topic-arn $TOPIC_ARN
#done



