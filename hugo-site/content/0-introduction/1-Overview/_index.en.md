+++
title = "Overview"
weight = 11
+++

![InnovatorIsland](/images/innovator-island_logo.png)

## Welcome to the Theme Park!

This exciting new theme park, built on the remote island of Isla Sanserver, combines rollercoasters and rides with shows and exhibits. The park is the creation of the billionaire entrepreneur behind Wild Rydes, the unicorn taxi service that sold in 2018. The park will open every day and expects up to 50,000 visitors daily. It's self-guided, using a web application that guests can browse on their smartphones. 

The only "slight" problem is that the development team has suddenly left and the park's Grand Opening is today! You only have hours to finish assembling the remaining pieces of the application before the gates open. But don't worry, serverless is at hand! These instructions will guide you through using AWS services to assemble a complete application so you can save the day.

## Application structure

You will be using a micro-services approach to configure a frontend and build a backend serverless application.

### Frontend
The frontend web application consists of an existing JavaScript web application managed with [AWS Amplify Console][amplify-console] that interfaces with services on the backend. You will only need to make minor changes to a configuration file in the frontend code to complete this workshop.

Amplify Console provides a simple, Git-based workflow for deploying and hosting fullstack serverless web applications. Amplify Console can create both the frontend and backend but for this workshop we will be using Amplify Console for only the frontend.

Amplify will be used to host static web resources including HTML, CSS, JavaScript, and image files which are loaded in the user's browser via S3. 

### Backend
The backend application architecture uses [AWS Lambda][lambda], [Amazon API Gateway][api-gw], [Amazon S3][s3], [Amazon DynamoDB][dynamodb], and [Amazon Cognito][cognito]. 

JavaScript executed in the frontend browser application sends and receives data from a public backend API built using API Gateway and Lambda. DynamoDB provides a persistence data storage layer which is used by the API's Lambda functions.

See the diagram below for the complete architecture.

![Overall architecture](/images/architecture-light.png)


[amplify-console]: https://aws.amazon.com/amplify/console/
[cognito]: https://aws.amazon.com/cognito/
[lambda]: https://aws.amazon.com/lambda/
[api-gw]: https://aws.amazon.com/api-gateway/
[s3]: https://aws.amazon.com/s3/
[dynamodb]: https://aws.amazon.com/dynamodb/