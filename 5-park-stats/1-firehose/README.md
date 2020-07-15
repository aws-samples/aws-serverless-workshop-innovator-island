# Module 5: Analyzing visitor stats - (1) Configure Kinesis Firehose

*[Click here](../README.md) to return the main instructions for Module 5 at any time.*

Amazon Kinesis Data Firehose is a fully managed service that reliably loads streaming data into data lakes, data stores and analytics tools. It can capture, transform, and load streaming data into Amazon S3, Amazon Redshift, Amazon Elasticsearch Service, and Splunk, enabling near real-time analytics with existing business intelligence tools like Amazon QuickSight.

It automatically scales to match the throughput of your data and requires no ongoing administration. You can configure a delivery stream and start sending data from hundreds of thousands of data sources to be loaded continuously to AWS – all in just a few minutes. 

## Inside this section

This section shows how to set up and configure a Kinesis Firehose delivery stream. Once this is complete, you can send events to this stream and they will be stored in S3 for analysis.

*More information on the services introduced in this section:*
* [Amazon Kinesis Firehose](https://aws.amazon.com/kinesis/data-firehose/)

## Configure a Kinesis Firehose delivery stream

**:white_check_mark: Step-by-step Instructions**

1. Go to the AWS Management Console, click **Services** then select **Kinesis** under Analytics. **Make sure your region is correct.**

2. Choose **Get started**, then choose **Create delivery stream** in the Firehose panel.

![Setup Firehose](../../images/module5-1-firehose-setup1.png)

3. For *Delivery stream name*, enter `theme-park-streaming-data`. Leave all the other defaults. Choose **Next**.

![Setup delivery stream](../../images/module5-1-firehose-setup2.png)

4. On the *Process records* page, leave the defaults and choose **Next**.

5. On the *Select a destination* page, in the *Destination* section leave *Amazon S3* selected. In the *S3 Destination* panel, choose **Create new**.

6. On the *Create S3 bucket* page:
- For *S3 bucket name* enter `theme-park-data-` followed by your AWS Account ID. 
- For *Region*, enter your current region.
- Choose *Create S3 bucket*.

**:star:You can find your AWS Account ID by clicking your name in the menu bar at the top of the page. If you can not find your AWS Account ID, you could also use a telephone number without any spaces or dashes.**

![Setup S3 bucket](../../images/module5-1-firehose-setup3.png)

7. Back in the *Select a destination* page, choose **Next**.

8. On the *Configure settings* page, scroll down to the *Permissions* section. Choose **Create or update IAM role**. Make a note of the role name that has been generated for your role.

![Setup IAM](../../images/module5-1-firehose-setup4.png)

9. Choose **Next**.

10. On the *Review page*, check your settings and then choose **Create delivery stream**.

![Review setup](../../images/module5-1-firehose-setup6.png)

11. Finally, on the *Kinesis Data Firehose delivery streams* page, wait until your new stream shows the status *Active*.

![Review setup](../../images/module5-1-firehose-setup7.png)

## Next steps

Next, you will deploy the simulator. To start the next section, [click here to continue](../2-simulator/README.md).

