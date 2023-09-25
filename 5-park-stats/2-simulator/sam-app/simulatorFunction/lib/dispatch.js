/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

// Libraries
const { Firehose, PutRecordBatchCommand } = require("@aws-sdk/client-firehose")
const firehose = new Firehose({region: process.env.AWS_REGION})

const DeliveryStreamName = process.env.streamName || 'theme-park-streaming-data'
const BATCH_LIMIT = 500
let batch = []
let sequenceId = 1

// Simple mechanism for dispatching messages to Kinesis

// Adds a new message to the current Kinesis batch
const addToBatch = async (message) => {
  // console.log(message)
  // https://github.com/aws/aws-sdk-js-v3/issues/2282#issuecomment-829297405
  batch.push(Buffer.from(JSON.stringify(message)))
  // console.log('Added msg - ', batch.length)
  if (batch.length === BATCH_LIMIT) {
    await flushBatch()
    batch = []
  }
}

// Flushes the batch to Kinesis
const flushBatch = async () => {
  const params = {
    DeliveryStreamName,
    Records: []
  }

  if (batch.length === 0) {
    return console.log('Empty batch - exiting')
  }

  batch.forEach(function (msg) {
    params.Records.push({"Data": msg})
  })

  console.log(params)
  try {
    const command = new PutRecordBatchCommand(params)
    const result = await firehose.send(command);
    if (result.FailedPutCount > 0) {
      console.log(`Firehose batch sequence ${sequenceId}. Failure: : ${result}`)
    }
    sequenceId++
    batch = []
  } catch (err) {
    console.error(err)
  }
}

// Exports
module.exports = {
  addToBatch,
  flushBatch
}
