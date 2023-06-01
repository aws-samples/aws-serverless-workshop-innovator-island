+++
title = "Deploy and run the simulator"
weight = 13
+++

*[Click here](./0-overview.html) to return the main instructions for Module 5 at any time.*

To simulate the load expected from a full park of visitors, you will deploy a simulator. This is a custom application running in a Lambda function.

## How it works

* You will deploy the simulator application using SAM. The simulator runs in a Lambda function.
* The simulator generates approximately hundreds of thousands messages for ~30,000 visitors. On average, it produces 500Mb of streaming data. It will take ~5 minutes to simulate an entire 12-hour park day, streaming at an average 1000 transactions per second.
* These messages are sent to the Kinesis Firehose delivery stream you configured in the previous step. They will start appearing in the dedicated S3 bucket shortly after the simulator starts.
* A typical message is a JSON object - here is an example for a completed ride by a visitor:

```
{
    "event:": "Ride",
    "rideId": "ride-014",
    "rating": 4,
    "timestamp": "2020-02-25T20:59:33.184Z",
    "visitorId": 9,
    "visitor": {
        "id": 9,
        "firstName": "Kacie",
        "lastName": "Kahn",
        "age": 18,
        "birthday":
            "month": 7,
            "day": 25
        },
        "home": {
            "latitude": 42.058359409010635,
            "longitude": -90.28163047438535
        },
        "arrivalTime": "2020-02-25T20:20:16.787Z",
        "totalRides": 4
    }
}
```
## Deploy the simulator application

### Step-by-step instructions ###

1. Go back to your browser tab with Cloud9 running. If you need to re-launch Cloud9, from the AWS Management Console, select **Services** then select **Cloud9** under *Developer Tools*.

{{% notice info %}}
Make sure your region is set to the same region you initially selected for Cloud9.
{{% /notice %}}

2. In the terminal, execute the following commands. First, change directory:

```
cd ~/environment/theme-park-backend/5-park-stats/2-simulator/sam-app
```
3. Store the Firehose delivery stream ARN as a variable:
```
DELIVERY_STREAM=$(aws firehose describe-delivery-stream --delivery-stream-name theme-park-streaming-data --query "DeliveryStreamDescription.DeliveryStreamARN")
echo $DELIVERY_STREAM
```
![Delivery stream variable](/images/5-2-delivery-stream-var.png)

4. Now, build and deploy the SAM application:
```
sam build
sam package --output-template-file packaged.yaml --s3-bucket $s3_deploy_bucket
sam deploy --template-file packaged.yaml --stack-name theme-park-simulator --capabilities CAPABILITY_IAM --parameter-overrides StreamArn=$DELIVERY_STREAM
```

The *parameter-overrides* option allows you to pass parameters into the deployment in the deployment process. In this case, you are passing the Kinesis delivery stream ARN into the *StreamArn parameter* in the SAM template. Learn more about sam deploy options in the [documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html).

This will take a few minutes to deploy - wait for the confirmation message in the console before continuing.

5. Retrieve the name of the deployed Lambda function:

```
aws lambda list-functions | grep theme-park-simulator | grep FunctionName
```
![Lambda function name](/images/module5-2-simulator-getname.png)

6. Copy the name value to the clipboard (exclude the quotes). Now invoke the Lambda function asynchronously:
```
aws lambda invoke --function-name ENTER_FUNCTION_NAME --invocation-type Event --payload '{}' response.json
```
![Invoke Lambda function](/images/module5-2-simulator-invoke-lambda.png)

7. The simulator is now running in the background and takes 4-5 minutes to complete. Continue with the workshop without waiting.

## Observing the output in S3

### Step-by-step Instructions ###

1. Go to the S3 console - from the AWS Management Console, select **Services** then select **S3** under *Storage*. **Make sure your region is correct.**

2. Select the bucket beginning with the name `theme-park-data` to view its contents.

3. Click through the folders (year, month, day, hour) until reaching the sub-folder with the streaming data objects.

![Lambda function name](/images/module5-2-simulator-s3b.png)

4. Click the refresh icon on this page while the simulation is running to see new objects as they are written to the bucket by Kinesis.

## Next steps

At this stage, the simulation is running and logging output to Kinesis. Your delivery stream is aggregating the data into the dedicated S3 bucket. Wait 4-5 minutes until the simulation finishes before continuing.

Next, you will analyze the data for business insights with Amazon QuickSight. To start the next section, [click here to continue](./3-quicksight.html).
