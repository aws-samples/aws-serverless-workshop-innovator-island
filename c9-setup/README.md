# Setting up AWS Cloud9

## Logging into AWS Event Engine

To complete this workshop, you are provided with an AWS account via the AWS Event Engine service. You will find a 12-digit hash at your table - this is your unique access code.

1. Go to https://dashboard.eventengine.run to log into AWS Event Engine.

![Step 1](../images/c9-step1.png)

2. Enter your unique 12-digit hash code and choose *Accept Terms & Login*.

![Step 2](../images/c9-step2.png)

3. Choose **AWS Console**, then **Open AWS Console**.

This account will expire at the end of the workshop and the all the resources created will be automatically deprovisioned. You will not be able to access this account after today.

## Region selection

Use a single region for the duration of this workshop. This workshop supports the following regions:

- us-west-2 (US West - Oregon)
- us-east-2 (US East - Ohio)
- us-east-1 (US East - Northern Virginia)
- ap-southeast-2 (Sydney, Australia)
- eu-central-1 (Frankfurt, Germany)

Please select one of these in the top right corner.

![Step 3](../images/c9-step3.png)

## Starting AWS Cloud9 IDE

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. It includes a code editor, debugger, and terminal. Cloud9 comes pre-packaged with essential tools for popular programming languages and the AWS Command Line Interface (CLI) pre-installed so you don’t need to install files or configure your laptop for this workshop. 

Your Cloud9 environment will have access to the same AWS resources as the user with which you logged into the AWS Management Console. We strongly recommend using Cloud9 to complete this workshop.

**Cloud9 works best with Chrome or Firefox, not Safari. It cannot be used from a tablet.**

**:white_check_mark: Step-by-step Instructions**

1. From the AWS Management Console, Select **Services** then select **Cloud9** under Developer Tools. 

![Step 4](../images/c9-step4.png)

2. Select **Create environment**.

3. Enter `theme-park-development` into **Name** and optionally provide a **Description**.

![Step 5](../images/c9-step5.png)

4. Select **Next step**.

5. In **Environment settings**:
- Set the *Instance type* to **t2.micro (1 GiB RAM + 1 vCPU)**.
- Leave all other defaults unchanged.

![Step 6](../images/c9-step6-b.png)

6. Select **Next step**.

7. Review the environment settings and select **Create environment**. It will take a couple of minutes for your Cloud9 environment to be provisioned and prepared.

## Setting up Cloud9 IDE

1. Once ready, your IDE will open to a welcome screen. Below that, you should see a terminal prompt. Close the Welcome tab and drag up the terminal window to give yourself more space to work in. 

![Step 7](../images/c9-step7.png)

- You can run AWS CLI commands in here just like you would on your local computer. Remember for this workshop to run all commands within the Cloud9 terminal window rather than on your local computer.
- Keep your AWS Cloud9 IDE opened in a browser tab throughout this workshop.

2. Verify that your user is logged in by running the command `aws sts get-caller-identity`. Copy and paste the command into the Cloud9 terminal window. 

```console
aws sts get-caller-identity
```

- You'll see output indicating your account and user information:

```json
ec2-user:~/environment $ aws sts get-caller-identity
{
    "Account": "123456789012",
    "UserId": "AKIAI44QH8DHBEXAMPLE",
    "Arn": "arn:aws:iam::123456789012:user/Alice"
}
```

3. Clone the repo which will download a local copy of the instructions and code you will use to build the backend portion of the workshop. Run these commands in the Cloud9 terminal window:

```
cd ~/environment/
git clone https://github.com/aws-samples/aws-serverless-workshop-innovator-island ./theme-park-backend
```
- Within the Cloud9 file browser on the left hand side you can see the backend files have been downloaded.

![Module 0 Cloud9 clone](../images/0-setup-clone.png)

4. Next, install JQ to provide formatting for JSON in the console:
```
sudo yum install jq -y
```

5. Finally, update the tools and software in your Cloud9 instance with these commands:
```
cd ~/environment/theme-park-backend/0-setup/
chmod 744 bootstrap.sh   
./bootstrap.sh
```

### :star: Tips

:bulb: Keep an open scratch pad in Cloud9 or a text editor on your local computer for notes. When the step-by-step directions tell you to note something such as an ID or Amazon Resource Name (ARN), copy and paste that into your scratch pad.

### :star: Recap

:key: This is your unique AWS account for this workshop. It will expire after you finish today.

:key: Use the same region for the entirety of this workshop.

:key: Keep your [AWS Cloud9 IDE](#aws-cloud9-ide) opened in a browser tab

## Next steps

:white_check_mark: Now you have Cloud9 launched and initalized, wait for the workshop instructor to continue.
