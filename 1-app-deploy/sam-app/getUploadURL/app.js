/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */


'use strict'

const { v4: uuidv4 } = require('uuid')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl }  = require("@aws-sdk/s3-request-presigner");

// Main Lambda entry point
exports.handler = async (event) => {
  const result = await getUploadURL()
  console.log('Result: ', result)
  return result
}

const getUploadURL = async function() {
  const actionId = uuidv4()
  
  const client = new S3Client({region: process.env.AWS_REGION});
  const command = new PutObjectCommand({ Bucket: process.env.UploadBucket, Key: `${actionId}.jpg` });
  const url = await getSignedUrl(client, command, { ContentType: 'image/jpeg'  });
    
  console.log('getUploadURL: ', url);
  
  // Get signed URL
  return  {
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": url,
          "photoFilename": `${actionId}.jpg`
      })
  }
}
