/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


'use strict'

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const docClient = DynamoDBDocument.from(new DynamoDB())
 
exports.lambdaHandler = async (event, context) => {
  try {
    const params = {
      TableName:  process.env.DDB_TABLE_NAME
    }
    const result = await docClient.scan(params)

    return {
      'statusCode': 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },      
      'body': JSON.stringify({
          result
      })
    }
  } catch (err) {
      console.error(err)
      return err
  }
}
