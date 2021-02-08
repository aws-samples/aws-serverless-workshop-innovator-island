/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


'use strict'

const { v4: uuidv4 } = require('uuid')
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

// Main Lambda entry point
exports.handler = async (event) => {
  const result = await getUploadURL()
  console.log('Result: ', result)
  return result
}

const getUploadURL = async function() {
  const actionId = uuidv4()
  
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key:  `${actionId}.jpg`,
    ContentType: 'image/jpeg' // Update to match whichever content type you need to upload
    //ACL: 'public-read'      // Enable this setting to make the object publicly readable - only works if the bucket can support public objects
  }

  console.log('getUploadURL: ', s3Params)
  return new Promise((resolve, reject) => {
    // Get signed URL
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": s3.getSignedUrl('putObject', s3Params),
          "photoFilename": `${actionId}.jpg`
      })
    })
  })
}
