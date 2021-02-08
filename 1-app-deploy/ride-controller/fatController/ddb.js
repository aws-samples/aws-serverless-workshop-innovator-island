'use strict'

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()

const masterTable = process.env.DDBtable

// Get all rides from the table
const getRides = async () => {
  const result = await documentClient.scan({
    TableName: masterTable
  }).promise()
  return result.Items
}

// Updates ride in the table
const updateRide = async (ride) => {
  
  ride.lastUpdated = Date.now()

  await documentClient.put({
    TableName: masterTable,
    Item: ride
  }).promise()
}

module.exports = { getRides, updateRide }
