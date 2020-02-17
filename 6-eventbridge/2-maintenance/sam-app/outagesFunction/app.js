// Invoked by an EventBridge rules, publishes new enriched events
// to EventBridge default bus:
// 1. DetailType "outage" - individual ride outage information

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const eventbridge = new AWS.EventBridge()

const CACHE_TIME = 180  // length of cache in seconds
let alertCache = {}     // Local cache that surives between warm invocations

// This section simulates a process that extracts more information
// regarding the ride outage. Here, it randomly pulls from a general
// list of ride problems and caches the ride/outage combination for
// CACHE_TIME seconds.

const alerts = [
    [0, "Info", "Loading new train for operation"],
    [1,	"Info", "Unloading train from operation"],
    [2,	"Warning", "Ride fault - fail-safe triggered"],
    [3,	"Warning", "Ride fault - ride vehicle not registering"],
    [4,	"Warning", "Ride fault - ride vehicle safety triggered"],
    [5,	"Warning", "Ride fault - unspecified failure"],
    [6,	"Warning", "Operator triggered shutdown"],
    [7,	"Emergency", "Emergency sequence triggered"],
    [8,	"Info", "Removing ride vehicle for maintenance"],
    [9,	"Warning", "Passenger alert - stopping ride for passenger assist"],
    [10, "Warning", "Passenger alert - sickness (no support requested)"],
    [11, "Emergency", "Passenger alert - sickness (EMT requested)"],
    [12, "Info", "Ride pyrotechnics maintenance"],
    [13, "Info", "Ride fogging maintenance"],
    [14, "Info", "Restarting ride initialization sequence"],
    [15, "Info", "Audio/visual synchronization check request"],
    [16, "Info", "Rider lost property"],
    [17, "Warning", "Ride element failed - request maintenance"],
    [18, "Info", "Cycling all ride vehicles"],
    [19, "Info", "Visually inspecting ride"],
    [20, "Emergency", "Evacuating riders"]
]

const rideAlerts = {
    "ride-001":	[ 6, 13, 14, 15, 16, 19 ],
    "ride-002":	[ 0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19 ],
    "ride-003":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 18, 19, 20 ],
    "ride-004":	[ 2, 6, 10, 14, 16, 19 ],
    "ride-005":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 18, 19, 20 ],
    "ride-006":	[ 2, 6, 10, 14, 16, 19 ],
    "ride-007":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 18, 19, 20 ],
    "ride-008":	[ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 19, 20 ],
    "ride-009":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 18, 19, 20 ],
    "ride-010":	[ 9, 10 ],
    "ride-011":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20 ],
    "ride-012":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20 ],
    "ride-013":	[ 6, 10, 16 ],
    "ride-014":	[ 2, 6, 10, 14, 16, 19 ],
    "ride-015":	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 17, 18, 19 ],
    "ride-016":	[ 2, 6, 9, 12, 13, 15, 16, 19, 20]
}

// Checks for empty JSON object
const isEmpty = (obj) => ( Object.keys(obj).length === 0 && obj.constructor === Object )

exports.handler = async (event) => {
    const rideId = event.detail.rideId
    const selectedAlerts = rideAlerts[rideId]

    console.log('Event: ', event)
    console.log('Cache: ', alertCache)
    
    // Randomly select a reason code 
    const reasonIndex = parseInt(Math.random() * selectedAlerts.length)
    const reason = alerts[reasonIndex]
    let message = {}

    // Check cache for recent failure on this ride
    if (alertCache.hasOwnProperty("rideId")) {
        if ( (Date.now() - alertCache[rideId].lastAlert) / 1000 < CACHE_TIME )  {
            message = alertCache[rideId]    
            console.log('Cache hit: ', message)
        }
    }

    // Nothing in cache - generate failure    
    if (isEmpty(message)) {
        alertCache[rideId] = {
            "rideId": rideId,
            "lastAlert": Date.now(),
            "type": reason[1],
            "description": reason[2],
            "timeToResolution": event.detail.wait
        }
        message = alertCache[rideId]    
    }
    
    console.log('Message: ', message)

    // Publish to EventBridge
    console.log(await eventbridge.putEvents({
        Entries: [
          {
            // Event envelope fields
            Source: 'themepark.rides',
            EventBusName: 'default',
            DetailType: 'outage',
            Time: new Date(),
        
            // Main event body
            Detail: JSON.stringify(message)
          }
        ]
    }).promise())    
}
