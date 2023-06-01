/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const {
          DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      {
          DynamoDB
      } = require("@aws-sdk/client-dynamodb"),
      {
          IoTDataPlane: IotData
      } = require("@aws-sdk/client-iot-data-plane");
const ddb = DynamoDBDocument.from(new DynamoDB())
const iotdata = new IotData({ endpoint: 'https://' + process.env.IOT_DATA_ENDPOINT })

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
        })
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
        });
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
