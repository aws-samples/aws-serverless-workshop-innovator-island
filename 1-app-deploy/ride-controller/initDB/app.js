
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

// Modified from https://github.com/stelligent/cloudformation-custom-resources/blob/master/lambda/nodejs/customresource.js

const { initRides } = require ('./initRides')

exports.handler = async function (event, context) {
  console.log('REQUEST RECEIVED:\n' + JSON.stringify(event))

  if (event.RequestType === 'Create') {
    console.log('CREATE!')
    // Put your custom create logic here
    await initRides()
    await sendResponse(event, context, 'SUCCESS', { 'Message': 'Resource creation successful!' })
  } else if (event.RequestType === 'Update') {
    console.log('UPDATE!')
    // Put your custom update logic here
    await initRides()
    await sendResponse(event, context, 'SUCCESS', { 'Message': 'Resource update successful!' })
  } else if (event.RequestType === 'Delete') {
    console.log('DELETE!')
    // Put your custom delete logic here
    await sendResponse(event, context, 'SUCCESS', { 'Message': 'Resource deletion successful!' })
  } else {
    console.log('FAILED!')
    await sendResponse(event, context, 'FAILED')
  }

  console.log('FINISHED')
}

// Send response to the pre-signed S3 URL
function sendResponse (event, context, responseStatus, responseData) {
  return new Promise((resolve, reject) => {

    console.log('Sending response ' + responseStatus)
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
    })

    console.log('RESPONSE BODY:\n', responseBody)

    const https = require('https')
    const url = require('url')

    const parsedUrl = url.parse(event.ResponseURL)
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': responseBody.length
      }
    }

    console.log('SENDING RESPONSE...\n')

    const request = https.request(options, function (response) {
      console.log('STATUS: ' + response.statusCode)
      console.log('HEADERS: ' + JSON.stringify(response.headers))
      // Tell AWS Lambda that the function execution is done
      resolve()
    })

    request.on('error', function (error) {
      console.log('sendResponse Error:' + error)
      // Tell AWS Lambda that the function execution is done
      reject()
    })

    // write data to request body
    request.write(responseBody)
    request.end()
  })
}
