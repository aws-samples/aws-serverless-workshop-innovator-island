/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */
'use strict'
const { main } = require ('./simulation.js')

// The standard Lambda handler

exports.handler = async (event) => {
  console.log('Handler started')
  // Check the output bucket exists
  if (!process.env.streamName)
    return console.log('Error: process.env.streamName not defined')

  await main()
  console.log('Handler ended')
  return { statusCode: 200 }
}
