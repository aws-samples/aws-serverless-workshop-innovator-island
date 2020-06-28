// Library documentation: https://www.npmjs.com/package/jimp

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()
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

// Module 3 - Compositing
// This function composites three images - a background, the green screen photo and a branding frame.
// The composited image is put back to S3 in the final bucket.

exports.handler = async (event) => {

  const params = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: event.Records[0].s3.object.key
  }

  // Load greenscreen person foreground (already resized to 600w x 800h in previously Lambda function)
  const s3Object = await s3.getObject(params).promise()
  const foreground  = await Jimp.read(s3Object.Body)

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
    ACL: 'public-read'
  }
  console.log(outParams)
  console.log(await s3.putObject(outParams).promise())
}

/*
  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
