/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


'use strict'

const { v4: uuidv4 } = require('uuid')
const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3({ region: process.env.AWS_REGION })

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

  const command = new PutObjectCommand(s3Params);
  const url = await getSignedUrl(s3, command);
  console.log('getUploadURL: ', s3Params, ' getSignedUrl: ', url)
  return new Promise((resolve, reject) => {
    // Get signed URL
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": url,
          "photoFilename": `${actionId}.jpg`
      })
    })
  })
}
