+++
title = "Overview"
weight = 11
+++

The theme park application consists of a frontend and backend - in this module, you will set up the frontend and then connect it to the backend.

The frontend is a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_applications) (PWA) developed in [Vue.js](https://vuejs.org/).

The frontend code is provided so you will only need to download the code and deploy into your own Git-based code repository stored in CodeCommit. Using [AWS Amplify Console](https://aws.amazon.com/amplify/console/), you will create a continuous deployment pipeline to publish your frontend application.

The backend is a set of serverless microservices. In this section we will set up the following:

* A DynamoDB table containing information about all the rides and attractions throughout the park.
* A Lambda function which performs a table scan on the DynamoDB to return all the items.
* An API Gateway API which creates a public http endpoint for the front-end application to query. This invokes the Lambda function to return a list of rides and attractions.

Once you have built the back-end resources needed, you will update the front-end application configuration to query the API Gateway endpoint and display the information about all the rides and attractions.

Each of the following sections provides an implementation overview and detailed, Step-by-step instructions. Remember: if you have any questions, contact one of the AWS employees located around the room.

{{% notice note %}}
Please ensure you have completed the [Setup Guide](/0-setup) first!
{{% /notice %}}

{{% notice info %}}
This module is also available to [watch on YouTube](https://www.youtube.com/watch?v=uLTRI0ijmjw).
{{% /notice %}}

{{% button href="https://github.com/aws-samples/aws-serverless-workshop-innovator-island" icon="fab fa-github" %}}See the GitHub repo{{% /button %}}
