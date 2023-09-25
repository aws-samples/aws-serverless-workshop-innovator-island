/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const documentClient = DynamoDBDocumentClient.from(client)

const { IoTDataPlaneClient, PublishCommand } = require("@aws-sdk/client-iot-data-plane");

const iotClient = new IoTDataPlaneClient({
    region: process.env.AWS_REGION, endpoint: 'https://' + process.env.IOT_DATA_ENDPOINT

});

/* MODULE 3 - Post Processing

   This function is triggered when the final composited photo is saved to S3.
   It saves the object name to DynamoDB and alerts the front-end via IoT.
*/

// Commits the latest message to DynamoDB
const saveToDDB = async function (params) {
    try  {
        await documentClient.send(new PutCommand({
            TableName: process.env.DDB_TABLE_NAME,
            Item: {
                'partitionKey': 'user-photo',
                'sortKey': new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                'objectKey': params.ObjectKey,
                'URL': params.URL
            }
        }))
        console.log('saveToDDB success');
    } catch (err) {
        console.error('saveToDDB error: ', err);
    }
}

// Publishes the message to the IoT topic
const iotPublish = async function (message) {
    const wrappedMessage = JSON.stringify({
        level: 'info',
        type: 'photoProcessed',
        message
    })
    console.log('iotPublish msg: ', wrappedMessage)
    try {
        await iotClient.send(new PublishCommand({
            topic: 'theme-park-rides',
            qos: 0,
            payload: wrappedMessage
        }))
        console.log('iotPublish success')
    } catch (err) {
        console.error('iotPublish error:', err)
    }
}

// The handler invoked by Lambda.
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event))
    
    const params = {
      ObjectKey: event.Records[0].s3.object.key,
      URL: `https://${process.env.WEB_APP_DOMAIN}/${event.Records[0].s3.object.key}`
    }

    console.log(params)
    await saveToDDB(params);
    await iotPublish(params)

    return true
}