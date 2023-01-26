+++
title = "Configure and use QuickSight"
weight = 14
+++

*[Click here](./0-overview.html) to return the main instructions for Module 5 at any time.*

Using the data from the simulation, you will use Amazon QuickSight to answer questions related to the operation of the theme park. In this section, you will configure QuickSight and create insights based on the simulation data.

## Creating a QuickSight account

### Step-by-step Instructions ###

1. Go to the AWS Management Console, click **Services** then select **QuickSight** under Developer Tools. **Make sure your region is correct.**

2. Choose **Sign up for QuickSight**.

![Sign up for QuickSight](/images/module5-3-signup.png)

3. In the *Create your QuickSight account* page, select the **Standard** option.

![Enterprise plan](/images/module5-3-signup-2.png)

4. In the *Create your QuickSight account* page in the sign-up process:
- For *Region*, select the region in the dropdown you have been using in the workshop.
- For *QuickSight account name*, enter `theme-park-admin-` followed by your AWS account ID.
- For *Notification email address*, enter your email address.
- In *Allow access and autodiscovery for these resources*, Click *Select S3 buckets* and a popup dialog will appear.

{{% notice info %}}
You can find your AWS Account ID by clicking your name in the menu bar at the top of the page. If you can not find your AWS Account ID, you could also use a telephone number without any spaces or dashes.
{{% /notice %}}

5. In the *Select Amazon S3 buckets* popup, uncheck *Select All* then check the S3 bucket beginning with `theme-park-data`. Choose **Finish**.

![S3 buckets](/images/module5-3-signup-4.png)

6. Finally, choose **Finish**.

7. QuickSight will now create your account. The process takes a few seconds. Choose **Go to Amazon QuickSight** when the button is available.

![Go to QuickSight](/images/module5-3-signup-5.png)

8. Close any *What's New* splash screens that may appear.

## Configure QuickSight

First, you must connect a data source and prepare the data for analysis.

### Step-by-step Instructions ###

1. Select *Datasets* on the left-side menu and choose **New dataset**.

![Manage data](/images/module5-3-configure1.png)

2. Choose **S3**.

![S3 data set](/images/module5-3-configure-3.png)

4. Open a text editor on your local machine, and paste the following contents. Ensure you enter your S3 bucket name
(the bucket beginning with `theme-park-data`) and save the file as `manifest.json`.

```
{
   "fileLocations":[
      {
         "URIPrefixes":[
            "s3://ENTER-YOUR-BUCKET-NAME/"
         ]
      }
   ],
   "globalUploadSettings":{
      "format":"JSON"
   }
}
```

5. On the *New S3 data source* form:
- Enter `theme-park-data` for *Date source name*.
- Select the *Upload* radio button.
- Choose the file uploader icon and select the manifest file saved in the previous step.
- Choose **Connect**.

![New S3 data source](/images/module5-3-configure-4.png)

6. On the *Finish data set creation* dialog box, choose **Edit/Preview data**.

![New S3 data source](/images/module5-3-configure-5.png)

### Prepare the data

You must change the datatypes of some fields for QuickSight to use these properly in visualization.

1. On the left of the page, there is the list of fields found in the dataset. Hover your mouse over the *visitor.home.latitude* field, click the elipsis (...), select *Change data type* and then select **Latitude**.

![Latitude field](/images/module5-3-configure-6.png)

2. Hover your mouse over the *visitor.home.longitude* field, click the elipsis (...), select *Change data type* and then select **Longitude**.

2. Hover your mouse over the *rating* field, click the elipsis (...), select *Change data type* and then select **Integer**.


4. Choose **Add calculated field**.
- For *Name*, enter **minutesInPark**.
- In the formula box, enter `dateDiff(visitor.arrivalTime, timestamp, "MI")`.
- Choose **Save**.

![Calculated field](/images/module5-3-configure8.png)

5. Choose **Save & publish**.

![Dataset](/images/module5-3-configure-7.png)

## Create analysis

1. Click the *QuickSight* logo in the top left of the screen to return to the application's main menu. Choose **New analysis**.

![New analysis](/images/module5-3-configure9.png)

2. In *Your Data Sets*, choose **theme-park-data**.

![Your data sets](/images/module5-3-configure-10-08312022.png)

3. Choose **USE IN ANALYSIS**.

![Your data sets](/images/module5-3-configure-11-08312022.png)

4. In the analysis dashboard, note the following areas on the display, since you will need these to build the data visualizations:
- 1 - Analysis menu bar.
- 2 - Fields list.
- 3 - Visualization types.
- 4 - Field wells, for modifying fields in visualizations.
- 5 - Worksheet, containing multiple visualization panels.

![Analysis dashboard](/images/module5-3-configure-12.png)

Each of the visualization challenges is completed using the analysis dashboard.

## Building visualizations

Add each of the following visualizations to your analysis dashboard:

1. Average length of park visit by age. [Go to instructions...](./3-quicksight/1-visual.html)
2. Where are the visitors from? [Go to instructions...](./3-quicksight/2-visual.html)
3. Arrival time by visitor age. [Go to instructions...](./3-quicksight/3-visual.html)
4. Ride rating by popularity. [Go to instructions...](./3-quicksight/4-visual.html)
5. How many total rides today? [Go to instructions...](./3-quicksight/5-visual.html)

Once you have the five visualulations on your worksheet, rename your worksheet, and resize the visualizations to fit the dashboard.

![Completed dashboard](/images/module5-3-visualization-all.png)
