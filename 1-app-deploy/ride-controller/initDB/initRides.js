/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client)

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
        console.log("params"+JSON.stringify(params))
        const result = await documentClient.send(new BatchWriteCommand(params));
        console.log('initRides result: ', result)
    } catch (err) {
        console.error('initRides error: ', err)
    }
}

module.exports = { initRides }
