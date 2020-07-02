const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' })
const documentClient = new AWS.DynamoDB.DocumentClient()

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
    console.log(params)
    const result = await documentClient.batchWrite(params).promise()
    console.log('initRides result: ', result)
  } catch (err) {
    console.error('initRides error: ', err)
  }
}

module.exports = { initRides }
