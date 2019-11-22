const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const iotdata = new AWS.IotData({ endpoint: process.env.IOT_DATA_ENDPOINT })

/* MODULE 3 - Real-time ride wait times

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
