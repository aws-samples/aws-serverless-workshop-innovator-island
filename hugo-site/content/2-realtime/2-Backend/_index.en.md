+++
title = "Backend"
weight = 12
+++

## How it works

* The Controller publishes updates every minute to an Amazon SNS topic. This has already been created for you.
* You will create a Lambda function in your account that is invoked whenever notifications arrive on this topic. This function will store the message in DynamoDB and forward the message to IoT Core.
* Finally, you will update the front-end application configuration to listen to this IoT endpoint, and republish the frontend.

*More information on the services introduced in this section:*
* [Amazon Simple Notification Service](https://aws.amazon.com/sns/)
* [AWS IoT Core](https://aws.amazon.com/iot-core/)

## The Real-Time Serverless Backend

![Module 3 architecture](../images/module3-overview.png)

* The Flow & Traffic Controller is already deployed and publishes updates to an SNS topic.
* The Lambda function receives new messages as an event payload and parses out the message. It then stores the message in a DynamoDB table and forwards to an IoT topic.
* The DynamoDB table only stores the last message. This initial state is needed when the front-end application is first loaded.
* The IoT topic is the conduit from the serverless backend to the front-end application. Any messages posted here will be received by the front-end.

## Set up environment variables

Run the following commands in the Cloud9 terminal to set environment variables used in this workshop:

```console
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
accountId=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .accountId)
s3_deploy_bucket="theme-park-sam-deploys-${accountId}"
```

{{% notice info %}}
Environment variables are not stored in the terminal. Any time you close Cloud9 or open a new terminal, you will need to rerun these commands to set environment variables. This section is provided in each module.
{{% /notice %}}

## Create the Lambda function

### Step-by-step instructions ###

1. Go to the Lambda console - from the AWS Management Console, select **Services** then select [**Lambda**](https://console.aws.amazon.com/lambda) under *Compute*. **Make sure your region is correct.** You will see some Lambda functions that SAM has already deployed.

2. Select **Create function**:
- Ensure **Author from scratch** is selected.
- Enter `theme-park-ridetimes` for *Function name*.
- Ensure `Node.js 16.x` is selected under *Runtime*.
- For *Architecture*, choose `arm64`.

{{% notice info %}}
Lambda functions that use arm64 architecture (AWS Graviton2 processor) can achieve significantly better price and performance than the equivalent function running on x86_64 architecture. For more information, read this [documentation page](https://docs.aws.amazon.com/lambda/latest/dg/foundation-arch.html?icmpid=docs_lambda_help).
{{% /notice %}}

3. Open the *Change default execution role* section:
-  Select the *Use an existing role* radio button.
- Click the *Existing role* drop-down, and enter **ThemeParkLambdaRole** until the filter matches a single available role beginning with *theme-park-backend-ThemeParkLambdaRole**.
- Select this role.
- Select **Create function**.

![Module 2 - Create Function](../images/2-realtime-lambda1.png)

4. Expand the *Function overview* section. Select **+ Add trigger**.

![Module 2 - Create Function 2](../images/2-realtime-lambda1a.png)

5. In the *Trigger configuration* dropdown, choose **SNS**. In the SNS topic selector, select the SNS topic starting with `theme-park-ride-times`:

![Module 2 - SNS](../images/2-realtime-lambda2b.png)

6. Choose *Add*.

7. Back in the function view, select the **Code** tab. This opens the code source panel below.

![Module 2 - SNS completed](../images/2-realtime-lambda3.png)

8. Back in the Cloud9 browser tab, run these commands to send the code and dependencies to the Lambda function:

```
cd ~/environment/theme-park-backend/2-realtime/
npm install
rm --force function.zip && zip -r function.zip app.js node_modules/
aws lambda update-function-code --function-name theme-park-ridetimes --zip-file fileb://function.zip
```

9. Go back to the browser tab with the Lambda console. In the *Code source* card and scroll down to *Runtime settings*. Click Edit, change the handler to `app.handler` and click *Save*

This Lambda function code reads the latest message from the SNS topic, writes it to the DynamoDB table, and then pushes the message to the frontend application via an IoT topic.

## Adding environment variables

This function uses three environment variables:
- `IOT_DATA_ENDPOINT`: the IoT endpoint hostname.
- `IOT_TOPIC`: The name of the IoT topic to publish messages to, which is `theme-park-rides`.
- `DDB_TABLE_NAME`: The name of the application's DynamoDB table.

In this section, you will retrieve and configure these Environment Variables for the function.

### Step-by-step instructions ###

1. Go back to your browser tab with Cloud9 running. If you need to re-launch Cloud9, from the AWS Management Console, select **Services** then select **Cloud9** under *Developer Tools*. **Make sure your region is correct.**

2. In the terminal enter the following command to retrieve the value for IOT_DATA_ENDPOINT:

```
aws iot describe-endpoint --endpoint-type iot:Data-ATS --query endpointAddress --output text
```
3. Next, enter the following command to retrieve the value for DDB_TABLE_NAME:
```
aws dynamodb list-tables | grep backend
```
![Module 2 - Terminal](../images/2-realtime-lambda5.png)

4. Go back to the browser tab with the `theme-park-ridetimes` Lambda function open. Choose the *Configuration* tab, then select the *Environment variables* menu option on the left.

![Module 2 - Terminal](../images/2-realtime-envvar.png)


5. In the *Environment variables* card, choose **Edit**.

6. Choose **Add environment variable** three times to enter the three environment variables, as follows:
- IOT_DATA_ENDPOINT - the value from step 2 above (without quotes).
- DDB_TABLE_NAME - the value from step 3 above (without quotes).
- IOT_TOPIC - `theme-park-rides`

![Module 2 - Environment vars](../images/2-realtime-lambda6.png)

7. Choose **Save**.

{{% notice warning %}}
Ensure you have entered the environment variables into the *Environment variables* card, not the *Tags* card.
{{% /notice %}}
