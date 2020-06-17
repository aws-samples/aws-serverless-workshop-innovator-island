# Workshop Cleanup

This page provides instructions for cleaning up the resources created during the preceding modules. Many resources would cost you nothing under the free tier, but removing them is recommended.

## Cleaning up resources

To remove and delete resources used by this workshop:

### 1. Quicksight
1.  From the [QuickSight console][quicksight-console], select the admin menu(top right) and choose **Manage QuickSight**.
1.  Select *Account settings* and choose **Unsubscribe**.
1.  This deletes all visualizations and stops billing.
1.  Take not of the IAM roles and policies
1.  From the [IAM console][iam-console], navigate to Roles, and then Policies and delete the Quicksight IAM role and policy.

### 2. Cloud9
1.  From the [Cloud 9 console][cloud9-console], select your instance and choose **Delete**.
1.  This deletes all workshop data from the instance and stops billing.

### 3. S3 Buckets
1. Open the [S3 console][s3-console], filter by `theme-park-`. Select each bucket one by one and then choose **Delete**.
1. Complete the bucket deletion process.
1. Repeat this process for any remaining buckets.

### 4. Resources in CloudFormation
1.  From the [CloudFormation console][cloudformation-console], select each stack beginning with `theme-park` and choose **Delete**.
1.  This deletes all resources associated with the stacks deployed in various modules. Note this process takes a few minutes.

### 5. Manually created Lambda functions
1.  From the [Lambda console][lambda-console], filter by `theme-park-`. Select each function one by one and then choose Actions and **Delete**.
1.  This will remove all functions manually created in this workshop.

### 6. Kinesis Firehose
1.  Open the [Kinesis Firehose console][firehose-console], select the Data Firehose named `	theme-park-streaming-data` and choose **Delete**
1. Complete the Firehose deletion process.

### 7. SNS Topics
1.  Open the [SNS console][sns-console], select each SNS Topic beginning with `theme-park` and choose **Delete**.
1.  Complete the SNS Topic deletion process.
1.  Repeat for each topic.

### 8. EventBridge Rules
1. Open the [Amazon EventBridge][eventbridge-console], and navigate to Events | Rules.
1. Select each EventBridge rule from the default Event bus beginning with `theme-park` and choose **Delete**.
1.  Complete the EventBridge rule deletion process.
1.  Repeat for each rule.

### 9. CodeCommit repository
1. Open the [AWS CodeCommit console][codecommit-console], and select the repository created for this workshop. Select **Delete repository** from the upper right of the page.
1. Complete the repository deletion process.

### 10. Amplify Console web applcation
1. Launch the [Amplify Console console][amplify-console-console], and select the application you launched in this workshop. From *Actions* in the top right corner, select *Delete App*.
1. Complete the application deletion process.

### 11. CloudWatch
1. Open the [Amazon CloudWatch][cloudwatch-console]
1. Navigate to *Logs | Log groups*, and select all log groups beginning with `theme-park`. From *Actions* in the top right corner, select **Delete log groups(s)** and choose **Delete**.
1. Navigate to *Dashboards*. Select the `InnovatorIsland` Dashboard, and from *Actions* in the top right corner, select **Delete dashboard** and choose **Delete dashboard**.


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
