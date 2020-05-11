// Invoked as an EventBridge target, publishes data to CloudWatch Metrics.

// Receives summary ride data. This functions iterates through the message,
// and publishes each ride time to CloudWatch Metrics

const AWS = require("aws-sdk")
AWS.config.region = ( process.env.AWS_REGION )
const cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

exports.handler = async (event) => {
  let params = {
    MetricData: [],
    Namespace: 'InnovatorIsland'
  }

  // Incoming message
  const msg = JSON.parse(event.detail.msg)

  msg.map((stat) => {
    params.MetricData.push({
      'MetricName': 'wait-times',
      'Dimensions': [
        {
          'Name': 'Type',
          'Value': 'ride'
        },
        {
          'Name': 'Ride',
          'Value': stat.rideId
        },
      ],
      'Unit': 'Seconds',
      'Value': (stat.wait * 60)
      }
    )
  })

  // Send to CloudWatch
  console.log(await cloudwatch.putMetricData(params).promise())
}
