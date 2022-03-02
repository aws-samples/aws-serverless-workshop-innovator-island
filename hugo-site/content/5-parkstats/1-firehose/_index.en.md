+++
title = "Configure Kinesis Firehose"
weight = 12
+++

*[Click here](./0-overview.html) to return the main instructions for Module 5 at any time.*

Amazon Kinesis Data Firehose is a fully managed service that reliably loads streaming data into data lakes, data stores and analytics tools. It can capture, transform, and load streaming data into Amazon S3, Amazon Redshift, Amazon Elasticsearch Service, and Splunk, enabling near real-time analytics with existing business intelligence tools like Amazon QuickSight.

It automatically scales to match the throughput of your data and requires no ongoing administration. You can configure a delivery stream and start sending data from hundreds of thousands of data sources to be loaded continuously to AWS – all in just a few minutes.

## Inside this section

This section shows how to set up and configure a Kinesis Firehose delivery stream. Once this is complete, you can send events to this stream and they will be stored in S3 for analysis.

*More information on the services introduced in this section:*
* [Amazon Kinesis Firehose](https://aws.amazon.com/kinesis/data-firehose/)

## Configure a Kinesis Firehose delivery stream

### Step-by-step instructions ##

1. Go back to your browser tab with Cloud9 running. If you need to re-launch Cloud9, from the AWS Management Console, select **Services** then select [**Cloud9**](https://console.aws.amazon.com/cloud9) under *Developer Tools*. **Make sure your region is correct.**

2. Create a bucket for Kinesis Firehose to deliver its output. The bucket name will be `theme-park-data-` followed by your AWS Account ID.

```
aws s3 mb s3://theme-park-data-${accountId}
```

![S3 bucket](/images/module5-1-firehose-createbucket.png)

2. Go to the AWS Management Console, click **Services** then select **Kinesis** under Analytics. **Make sure your region is correct.**

3. In *Get started*, select *Kinesis Data Firehose*, then choose **Create delivery stream**.

![Setup Firehose](/images/module5-1-firehose-setup1.png)

4. In the *Create a delivery stream* page:
- In the *Source* dropdown, choose **Direct PUT**.
- In the *Destination* dropdown, choose **Amazon S3**.
- For *Delivery stream name*, enter `theme-park-streaming-data`.

![Setup delivery stream](/images/module5-1-firehose-setup2.png)

5. Further down on the same page:
- In *Destination settings*, for *S3 bucket* enter the bucket name you created in step 2 (`theme-park-data-` followed by your AWS Account ID).
- Keep all the other defaults.

![Setup delivery stream](/images/module5-1-firehose-setup2b.png)

6. Open the *Advanced settings* panel. In the *Permissions* section, select **Create or update IAM role**. Make a note of the role name that has been generated for your role. You will use this later.

![Setup delivery stream](/images/module5-1-firehose-setup3.png)

7. Choose **Create delivery stream**.

8. Finally, on the *Delivery streams* page, wait until your new stream shows the status *Active*.

![Review setup](/images/module5-1-firehose-setup7.png)

## Next steps

Next, you will deploy the simulator. To start the next section, [click here to continue](./2-simulator.html).
