/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const{ DynamoDB } = require("@aws-sdk/client-dynamodb");
const documentClient = DynamoDBDocument.from(new DynamoDB({ region: process.env.AWS_REGION || 'us-east-1' }))

const TableName = process.env.DDBtable
const initRideState = require('./initRideState')

// BatchWrite params template
const params = {
  RequestItems: {
    [TableName]: []
  }
}

// Load in ride template
initRideState.map((ride) => {
  params.RequestItems[TableName].push ({
    PutRequest: {
      Item: {
        ...ride
      }
    }
  })
})

const initRides = async () => {
  try {
    console.log(params)
    const result = await documentClient.batchWrite(params)
    console.log('initRides result: ', result)
  } catch (err) {
    console.error('initRides error: ', err)
  }
}

module.exports = { initRides }
