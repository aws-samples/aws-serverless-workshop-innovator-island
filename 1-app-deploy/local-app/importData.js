const fs = require('fs')
const parse = require('csv-parse')
const AWS = require('aws-sdk')
AWS.config.update({ region: process.argv[2] })
const docClient = new AWS.DynamoDB.DocumentClient()
const CSV_FILENAME = './table.csv'

/* 
  USAGE:
  ------
   Run from the command line with two parameters:
  - Region (eg. us-east-1)
  - DynamoDB table (e.g. theme-park-backend-DynamoDBTable-ABCDE1234XYZ)

  E.g. node .\importData.js us-west-2 theme-park-backend-DynamoDBTable-ABCDE1234XYZ
*/

const uploadFileToDynamoDB = (err, data) => {

  // Separate into batches for upload
  let batches = []
  const BATCH_SIZE = 25
  const ddb_table = process.argv[3]

  while (data.length > 0) {
    batches.push(data.splice(0, BATCH_SIZE))
  }

  let batchCount = 0
  batches.map(async (item_data) => {

    // Set up the params object for the DDB call
    const params = {
      RequestItems: {}
    }
    params.RequestItems[ddb_table] = []
 
    item_data.forEach(item => {
      for (let key of Object.keys(item)) {
        // An AttributeValue may not contain an empty string
        if (item[key] === '') 
          delete item[key]
      }

      // Build params
      params.RequestItems[ddb_table].push({
        PutRequest: {
          Item: {
            ...item
          }
        }
      })
    })

    // Push to DynamoDB in batches
    try {
      console.log('Trying batch: ', batchCount)
      batchCount++
      const result = await docClient.batchWrite(params).promise()
      console.log('Success: ', result)
    } catch (err) {
      console.error('Error: ', err)
    }
  })
}
// Initialize the stream and the parser.
const rs = fs.createReadStream(CSV_FILENAME)

// Command line provides region and DDB table name
if(!process.argv[2])
  return console.error('Missing REGION in command line parameters.')
if(!process.argv[3])
  return console.error('Missing DYNAMODB TABLE NAME in command line parameters.')

// Upload the data
const parser = parse({
  columns: true,
  delimiter: ','
}, uploadFileToDynamoDB)
rs.pipe(parser)
