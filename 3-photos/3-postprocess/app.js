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
      URL: `https://${event.Records[0].s3.bucket.name}.s3.awsRegion.amazonaws.com/${event.Records[0].s3.object.key}`
    }

    console.log(params)
    await saveToDDB(params);
    await iotPublish(params)

    return true
}
