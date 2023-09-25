'use strict'

/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client)


// Get all rides from the table
const getRides = async () => {
    const result = await documentClient.send(new ScanCommand({
        TableName:  process.env.DDBtable}));
    return result.Items
}

// Updates ride in the table
const updateRide = async (ride) => {

    ride.lastUpdated = Date.now()
    console.log("ride"+ JSON.stringify(ride))

    await documentClient.send(new PutCommand({
        TableName: process.env.DDBtable,
        Item: ride
    }));
}

module.exports = { getRides, updateRide }
