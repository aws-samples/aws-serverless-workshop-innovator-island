'use strict'

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const TopicArn = process.env.TopicArn

const sendSNS = async (Message) => {
  // Send to SNS
  try {
    const result = await new AWS.SNS({apiVersion: '2010-03-31'}).publish({
      Message: JSON.stringify(Message),
      TopicArn
    }).promise()
    console.log('SNS result: ', result)
  } catch (err) {
    console.error(err, err.stack)
  }
}

module.exports = { sendSNS }