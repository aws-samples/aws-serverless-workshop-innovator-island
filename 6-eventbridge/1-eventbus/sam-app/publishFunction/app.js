// Invoked by an SNS topic, publishes events to EventBridge default bus:
// 1. DetailType "waitTimes" - individual ride times per event
// 2. DetailType "waitTimesSummary" - aggregated ride times

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const eventbridge = new AWS.EventBridge()
const MAX_ENTRIES = 10

exports.handler = async (event) => {

  const sns = event.Records[0].Sns
  const time = sns.Timestamp
  const message = JSON.parse(sns.Message)

  // Only interested in ride time summaries
  if (message.type !== 'summary') return

  // Convert stringified message into JSON object
  const msg = JSON.parse(message.msg)

  let params = {
    Entries: []
  }

  // Interate through in batches and push to EventBridge
  for (let i = 0; i < msg.length; i++) {
    const ride = msg[i]

    params.Entries.push({
      // Event envelope fields
      Source: 'themepark.rides',
      EventBusName: 'default',
      DetailType: 'waitTimes',
      Time: new Date(),
  
      // Main event body
      Detail: JSON.stringify({
        rideId: ride.rideId,
        inService: ride.inService,
        wait: ride.wait,
        lastUpdated: ride.lastUpdated
      })
    })
    
    // Maximum size of Entries for EventBridge is 10    
    if (params.Entries.length === MAX_ENTRIES) {
      console.log(params)
      console.log(await eventbridge.putEvents(params).promise())
      params.Entries = []
    }
  }

  // Clear anything left in the batch
  if (params.Entries.length > 0 ) {
    console.log(params)
    console.log(await eventbridge.putEvents(params).promise())
  } 
  
  // Post summary messsage to EventBridge with all contents
  console.log(await eventbridge.putEvents({
    Entries: [
      {
        // Event envelope fields
        Source: 'themepark.rides',
        EventBusName: 'default',
        DetailType: 'waitTimesSummary',
        Time: new Date(),
    
        // Main event body
        Detail: sns.Message 
      }
    ]
  }).promise())
}