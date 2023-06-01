'use strict'

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const{ DynamoDB } = require("@aws-sdk/client-dynamodb");
const documentClient = DynamoDBDocument.from(new DynamoDB({ region: process.env.AWS_REGION }))

const masterTable = process.env.DDBtable

// Get all rides from the table
const getRides = async () => {
  const result = await documentClient.scan({
    TableName: masterTable
  })
  return result.Items
}

// Updates ride in the table
const updateRide = async (ride) => {
  
  ride.lastUpdated = Date.now()

  await documentClient.put({
    TableName: masterTable,
    Item: ride
  })
}

module.exports = { getRides, updateRide }
