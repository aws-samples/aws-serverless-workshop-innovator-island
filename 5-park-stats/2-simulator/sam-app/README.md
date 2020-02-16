# Theme park simulator



Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

```bash
.
├── README.MD                   <-- This instructions file
├── batchingFunction            <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── s3.js                   <-- S3 helper functions
│   └── package.json            <-- NodeJS dependencies and scripts
├── translatorFunction          <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── s3.js                   <-- S3 helper functions
│   └── translate.js            <-- Wrapper for Amazon Translate service
│   └── package.json            <-- NodeJS dependencies and scripts
├── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 12.x installed](https://nodejs.org/en/download/)

## Installation Instructions

1. [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and login.

### Template 

```
sam package --output-template-file packaged.yaml --s3-bucket <<enter deployment bucket name>>
sam deploy --template-file packaged.yaml --capabilities CAPABILITY_IAM --stack-name example1-translate --region us-east-1 --parameter-overrides InputBucketName=<<enter translation bucket name>> TargetLanguage="<< languages >>"
```
## Parameter Details

* Target Language: a space-separated list of languages to translate the original text into (e.g. "fr es de")
* InputBucketName: the unique name of a new S3 bucket for this application (bucket names must be lowercase only and globally unique across AWS)
* BatchingBucketName: the unique name of a new S3 bucket for this application.

## How it works


==============================================

Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.

SPDX-License-Identifier: MIT-0