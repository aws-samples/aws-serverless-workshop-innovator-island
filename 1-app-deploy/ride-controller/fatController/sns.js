'use strict'

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const snsClient = new SNSClient({ region: process.env.AWS_REGION }); 

const TopicArn = process.env.TopicArn

const sendSNS = async (Message) => {
  // Send to SNS
  try {
    
    const result = await snsClient.send(new PublishCommand({
       Message: JSON.stringify(Message),
      TopicArn
    }));
    console.log('SNS result: ', result)
  } catch (err) {
    console.error(err, err.stack)
  }
}

module.exports = { sendSNS }