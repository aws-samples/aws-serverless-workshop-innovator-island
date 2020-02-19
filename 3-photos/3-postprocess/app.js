const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const iotdata = new AWS.IotData({ endpoint: process.env.IOT_DATA_ENDPOINT })
const IOT_TOPIC = 'theme-park-rides'

/* MODULE 3 - Post Processing

   This function is triggered when the final composited photo is saved to S3.
   It saves the object name to DynamoDB and alerts the front-end via IoT.
*/

// Commits the latest message to DynamoDB
const saveToDDB = async function (params) {
    try  {
        await ddb.put({
            TableName: process.env.DDB_TABLE_NAME,
            Item: {
                'partitionKey': 'user-photo',
                'sortKey': new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                'objectKey': params.ObjectKey,
                'URL': params.URL
            }
        }).promise();
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
    await iotdata.publish({
      topic: IOT_TOPIC,
      qos: 0,
      payload: wrappedMessage
    }).promise()
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
      URL: `https://${event.Records[0].s3.bucket.name}.s3.amazonaws.com/${event.Records[0].s3.object.key}`
    }

    console.log(params)
    await saveToDDB(params);
    await iotPublish(params)

    return true
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
