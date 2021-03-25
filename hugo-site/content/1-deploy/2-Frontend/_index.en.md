+++
title = "Frontend"
weight = 12
+++

## How it works - Frontend

* You will create a code repository in [AWS CodeCommit](https://aws.amazon.com/codecommit/).
* You will download the existing frontend code into your Cloud9 IDE and push the code to this repository.
* You will configure Amplify Console to connect to your repository and publish the web app.

After this section, you will be able to see the published web app on both your PC and mobile device by visiting the published URL.

## The Serverless Frontend

![Module 1 architecture](../images/module1-arch.png)

* All of your static web content including HTML, CSS, JavaScript, images and other files will be managed by AWS Amplify Console and served via Amazon CloudFront.
* Your end users will then access your site using the public website URL exposed by AWS Amplify Console. You don't need to run any web servers or use other services in order to make your site available.

*More information on the services introduced in this section:*
* [AWS Cloud9](https://aws.amazon.com/cloud9/)
* [AWS CodeCommit](https://aws.amazon.com/codecommit/)
* [AWS Amplify Console](https://aws.amazon.com/amplify/console/)

## Deploy the frontend infrastructure

### 1. Create the repository

1. Go to the [AWS Management Console](https://console.aws.amazon.com/), click **Services** then select [**CodeCommit**](https://console.aws.amazon.com/codecommit) under *Developer Tools.*

{{% notice note %}}
Make sure your region is set to the same region you initially selected for Cloud9.
{{% /notice %}}

2. Select **Create Repository**.
3. Set the *Repository name* to `theme-park-frontend`.
4. Select **Create**.

![Module 1 create repo](../images/module1-create-repo.png)

You will see when the CodeCommit repository is successfully created.

![Module 1 repo success](../images/module1-repo-success.png)

### 2. Clone the code base

Once your CodeCommit git repository is created, you'll need to pull in the existing files for your frontend app from GitHub and sync to your new CodeCommit repository.

1. Go back to your browser tab with Cloud9 running. If you need to re-launch Cloud9, from the AWS Management Console, select **Services** then select [**Cloud9**](https://console.aws.amazon.com/cloud9) under *Developer Tools*.

{{% notice warning %}}
Make sure your region is set to the same region you initially selected for Cloud9.
{{% /notice %}}

2. The AWS Cloud9 development environment comes with AWS managed temporary credentials that are associated with your IAM user. You use these credentials with the AWS CLI credential helper. Enable the credential helper by running the following two commands in the terminal of your Cloud9 environment.

```
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

3. Now run the following command to download the frontend code from GitHub into a separate local subdirectory from the backend instructions and code:
```
mkdir ~/environment/theme-park-frontend
cd ~/environment/theme-park-frontend
wget https://innovator-island.s3-us-west-2.amazonaws.com/front-end/theme-park-frontend-202102.zip
```
4. Unzip the code:
```
unzip theme-park-frontend-202102.zip 
```

Within the Cloud9 file browser on the left hand side you can see the theme-park-frontend files have been downloaded into a separate local directory from the theme-park-backend.

![Module 1 cloud9 files](../images/module1-cloud9files.png)

5. Push the downloaded code to populate your recently created CodeCommit repository:
```
cd ~/environment/theme-park-frontend/
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
git push --set-upstream https://git-codecommit.$AWS_REGION.amazonaws.com/v1/repos/theme-park-frontend main

```
![Module 1 git push](../images/module1-git-push.png)

### 3. Deploy the site with the AWS Amplify Console.

Next you'll use the AWS Amplify Console to deploy the frontend website you've just committed to the CodeCommit git repository. The Amplify Console takes care of the work of setting up a place to store your static web application code and provides a number of helpful capabilities to simplify both the lifecycle of that application as well as enable best practices.

## Step-by-step instructions ##

1. Launch [Amplify Console](https://console.aws.amazon.com/amplify/home).

2. Scroll down to the *Get started* section, then choose **Get Started** in the *Deliver* panel.
![Module 1 amplify splash](../images/module1-amplify-splash.png)

3. Under *Host your web app*, select **AWS CodeCommit** and select **Continue**.

![Module 1 connect app](../images/module1-connect-app.png)

4. Select *theme-park-frontend* under **Recently updated repositories**, then choose *main* under **Branch**. Select **Next**.

![Module 1 add repo](../images/module1-amplify-add-repo.png)

5. On the *Configure Build settings* page, leave the defaults, scroll down and select **Next**.

6. On the *Review* page, verify the settings and select **Save and deploy**.

The deployment process will take a few minutes to complete. Once the build has a completed the **Verify** stage, select the Amplify provided link for your app. 

![Module 1 amplify URL](../images/module1-amplify-URL.png)

This will open the published URL in your browser. You will see the empty park map with a navigation bar. At the moment, there is very little functionality in the application but we will add those features next.

Copy the published URL of your web app into your scratch pad. You will need this throughout the subsequent modules.

You can also open the URL on your mobile device. This PWA is designed for mobile, so the responsive layout will adjust for different device sizes.

Once you have tested the public URL on a browser and a mobile device, you can start to build the backend.

## 4. Viewing the deployed web app

After Amplify Console has deployed the app, open the published URL in the Google Chrome or Mozilla Firefox browser.

1. Press F12 to open Developer Tools in the browser.
2. In Google Chrome, click the **Toggle Device Toolbar** button to show a responsive, mobile-ready version of the site. In Firefox, the same function is called **Responsive Design Mode**.
3. Watch the *Console* area for useful messages as the web app is running.

![Module 1 browser](../images/1-app-deploy-browser.jpg)