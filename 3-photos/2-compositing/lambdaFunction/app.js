/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

 // Library documentation: https://www.npmjs.com/package/jimp

const { S3, GetObjectCommand } = require("@aws-sdk/client-s3")
const s3 = new S3({ region: process.env.AWS_REGION })
const Jimp = require('jimp')
const fs = require('fs');

// Wrapping promise around Jimp callback
const getBuffer = function(image) {
  return new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

// https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-1071508390
// FIXME for node 18.x: https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-1463923284
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    // I removed the .toString here
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

// Module 3 - Compositing
// This function composites three images - a background, the green screen photo and a branding frame.
// The composited image is put back to S3 in the final bucket.

exports.handler = async (event) => {

  const params = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: event.Records[0].s3.object.key
  }

  // Load greenscreen person foreground (already resized to 600w x 800h in previously Lambda function)
  const getObjectResponse = await s3.send(new GetObjectCommand(params));
  const s3Object = await streamToString(getObjectResponse.Body);
  const foreground  = await Jimp.read(s3Object)

  // Select random background (1-4 available)
  const random = Math.ceil(Math.random()*4)
  const background = await Jimp.read( `https://d15l97sovqpx31.cloudfront.net/images/composite-bg${random}.png`) // theme park background
  const branding = await Jimp.read('https://d15l97sovqpx31.cloudfront.net/images/edge-decor-600x1000.png') // branding frame

  // Composite background with greenscreen foreground (foreground in front - added vertical offset of 130px)
  const x = (background.bitmap.width/2) - (foreground.bitmap.width/2) // updated code here to center photo on background
  let composited = await background.composite(foreground, x, 130, { mode: Jimp.BLEND_SOURCE_OVER })

  // Composite with branding frame (branding in front)
  composited = await composited.composite(branding, 0, 0, { mode: Jimp.BLEND_SOURCE_OVER })

  // Save to temp location as JPEG
  const output_filename = params.Key.replace('.png', '.jpg')
  const output_path = `/tmp/${output_filename}`
  await composited.writeAsync(output_path)

  // Save to S3
  const outParams = {
    Bucket: process.env.OUTPUT_BUCKET_NAME,
    Key: output_filename,
    ContentType: Jimp.MIME_JPEG,
    Body: fs.readFileSync(output_path),
    //ACL: 'public-read'
  }
  console.log(outParams)
  console.log(await s3.putObject(outParams))
}