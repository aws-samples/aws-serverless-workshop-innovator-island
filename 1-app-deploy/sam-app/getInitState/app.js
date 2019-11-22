'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
 
exports.lambdaHandler = async (event, context) => {
  try {
    const params = {
      TableName:  process.env.DDB_TABLE_NAME
    }
    const result = await docClient.scan(params).promise()

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
