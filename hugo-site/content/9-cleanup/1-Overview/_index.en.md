+++
title = "Instructions"
weight = 11
+++

This page provides instructions for cleaning up the resources created during the preceding modules. Many resources would cost you nothing under the free tier, but removing them is recommended.

## Cleaning up resources

To remove and delete resources used by this workshop:

### 1. S3 Buckets
1. From Cloud9, to get a list of buckets used for the theme park, enter:
```
aws s3 ls | grep theme-park
```
2. Delete each bucket and its content, replacing `your-bucket-name` with each bucket name:
```
aws s3 rb --force s3://your-bucket-name
```

### 2. Resources in CloudFormation
1. From Cloud9, get a list of stacks used in this workshop:
```
aws cloudformation list-stacks | grep theme-park
```
2. Delete each stack beginning with `theme-park`, replacing `your-stack-name` with each stack name:
```
aws cloudformation delete-stack --stack-name your-stack-name
```

### 3. Manually created Lambda resources
1. From Cloud9, get a list of Lambda functions manually created in this workshop:
```
aws lambda list-functions | grep theme-park
```
2. Delete each function beginning with `theme-park`, replacing `your-function-name` with the function name:
```
aws lambda delete-function --function-name your-function-name
```
3. Delete the OpenCV Lambda layer:
```
aws lambda delete-layer-version --layer-name python-opencv-37 --version-number 1
```

### 4. CodeCommit repository
1. From Cloud9, delete the repo used by this workshop:
```
aws codecommit delete-repository --repository-name 'theme-park-frontend'
```

### 5. Amplify Console web application
1. From Cloud9, get a list of apps:
```
aws amplify list-apps
```
2. Delete the theme park app, replacing `your-app-id` with appId:
```
aws amplify delete-app --app-id 'your-app-id'
```

### 6. Quicksight
1.  From the [QuickSight console][quicksight-console], select the admin menu(top right) and choose **Manage QuickSight**.
1.  Select *Account settings* and choose **Unsubscribe**.
1.  This deletes all visualizations and stops billing.
1.  Take not of the IAM roles and policies
1.  From the [IAM console][iam-console], navigate to Roles, and then Policies and delete the Quicksight IAM role and policy.

### 7. Kinesis Firehose
1. From Cloud9, run:
```
aws firehose delete-delivery-stream --delivery-stream-name theme-park-streaming-data
```

### 8. SNS Topics
1. From Cloud9, get a list of SNS topics used in this workshop:
```
aws sns list-topics | grep theme-park
```
2. Delete each topic, replacing `your-topic-arn` with the topic arn:
```
aws sns delete-topic --topic-arn your-topic-arn
```

### 9. EventBridge Rules
1. From Cloud9, get a list of EventBridge rules used in this workshop:
```
aws events list-rules | grep theme-park
```
2. Delete each rule, replacing `your-rule-name` with the rule name:
```
aws events delete-rule --name 'your-rule-name'
```

### 10. CloudWatch
1. Open the [Amazon CloudWatch][cloudwatch-console]
1. Navigate to *Logs | Log groups*, and select all log groups beginning with `theme-park`. From *Actions* in the top right corner, select **Delete log groups(s)** and choose **Delete**.
1. Navigate to *Dashboards*. Select the `InnovatorIsland` Dashboard, and from *Actions* in the top right corner, select **Delete dashboard** and choose **Delete dashboard**.

### 11. AWS Cloud9
1.  From the [Cloud 9 console][cloud9-console], select your instance and choose **Delete**.
1.  This deletes all workshop data from the instance and stops billing.


[amplify-console-console]: https://console.aws.amazon.com/amplify/home
[api-gw-console]: https://console.aws.amazon.com/apigateway/home
[cloud9-console]: https://console.aws.amazon.com/cloud9/home
[codecommit-console]: https://console.aws.amazon.com/codesuite/codecommit/repositories
[cognito-console]: https://console.aws.amazon.com/cognito/home
[dynamodb-console]: https://console.aws.amazon.com/dynamodb/home
[iam-console]: https://console.aws.amazon.com/iam/home
[lambda-console]: https://console.aws.amazon.com/lambda/home
[cloudformation-console]: https://console.aws.amazon.com/cloudformation/home
[quicksight-console]: https://quicksight.aws.amazon.com/
[kinesis-console]: https://console.aws.amazon.com/kinesis/home
[firehose-console]: https://console.aws.amazon.com/firehose/home
[sns-console]: https://console.aws.amazon.com/sns/home
[s3-console]: https://console.aws.amazon.com/s3/home
[iam-console]:https://console.aws.amazon.com/iam/home
[eventbridge-console]:https://console.aws.amazon.com/events/home
[cloudwatch-console]:https://console.aws.amazon.com/cloudwatch/home
