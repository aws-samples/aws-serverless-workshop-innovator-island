const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const iotdata = new AWS.IotData({ endpoint: process.env.IOT_DATA_ENDPOINT })

/* MODULE 2 - Real-time ride wait times

   This function listens to an SNS topic published by the Flow & Traffic Controller
   which provides ride waiting times throughout the park. The handler stores the 
   latest message in DynamoDB and publishes the message to the IoT topic, which
   will then publish to the front end. */

// Commits the latest message to DynamoDB
const saveToDDB = async function (message) {
    try  {
        await ddb.put({
            TableName: process.env.DDB_TABLE_NAME,
            Item: {
                'partitionKey': 'config',
                'sortKey': 'waittimes',
                'message': message
            }
        }).promise()
        console.log('saveToDDB success')
    } catch (err) {
        console.error('saveToDDB error: ', err)
    }
}

// Publishes the message to the IoT topic
const iotPublish = async function (topic, message) {
    try {
        await iotdata.publish({
            topic,
            qos: 0,
            payload: JSON.stringify(message)
        }).promise();
        console.log('iotPublish success')
    } catch (err) {
        console.error('iotPublish error:', err)
    }
};

// The handler invoked by Lambda.
exports.handler = async (event) => {
    const message = JSON.parse(event.Records[0].Sns.Message)
    console.log('From SNS:', message)

    // Save ride time summary to DDB
    if (message.type === 'summary') {
        await saveToDDB(message.msg)
    }
    await iotPublish(process.env.IOT_TOPIC, message)

    return message
}

/*
  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
