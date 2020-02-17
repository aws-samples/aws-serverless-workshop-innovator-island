// Libraries
const moment = require('moment')
const probabilities = require('./lib/probabilities')
const Visitor = require('./lib/visitor')
const dispatch = require('./lib/dispatch')

// Globals
const timeStart = new Date()
timeStart.setHours(7) // Park opens at 7am
timeStart.setMinutes(00)

const MAX_MINS = (60 * 12)  // 12 hrs of park opening time
const MAX_PARK_CAPACITY = 50000  // Max people in park
const ACTIONS_PER_MIN = 1000  // Simulator limit
const MIN_TIME_BETWEEN_ACTIONS = 30  // Min delay between rides
let totalMin = 1
let hour = 1, min = 0

let visitors = []
let visitorId = 0

let totals = {
  visitors: 0,
  rides: 0,
  exits: 0,
  entries: 0
}

// Pad leading zeros (e.g. 1 --> 001)
function pad(num, size) {
  let s = num+""
  while (s.length < size) s = "0" + s
  return s
}

const main = async () => {
  console.time("main")

  while (totalMin < MAX_MINS) {
    // Move time forward by one minute
    let timeNow = moment(timeStart).add(totalMin, 'm').toDate()
    hour = Math.ceil(totalMin / 60)
    min = totalMin % 60

    // Perform all actions for the minute
    for (let i = 0; i < ACTIONS_PER_MIN; i++) {
      // Visitors arriving
      if (visitors.length < MAX_PARK_CAPACITY) {
        if (probabilities.doesVisitorArrive()) {
          const newVisitor = Visitor.createVisitor(visitorId, timeNow, totalMin)
          // console.log(`Visitor ${visitorId} arriving (${visitors.length} total)`)        
          visitors.push(newVisitor)
          await dispatch.addToBatch({
            "event:": "Entry", 
            "rideId": null,
            "rating": null,
            "timestamp": timeNow,
            "visitorId": newVisitor.id,
            "visitor": Visitor.getVisitor(newVisitor)
          })
          visitorId++
          totals.entries++
          totals.visitors++
        }
      }
    }

    // Visitors getting on a ride
    for (let i = 0; i < visitors.length; i++) {
      // Leave at leave MIN_TIME_BETWEEN_ACTIONS between last action
      const lastAction = visitors[i].lastActionIteration || 0
      if (totalMin - lastAction > MIN_TIME_BETWEEN_ACTIONS) {
        // Check if visitor decides to ride
        if (probabilities.rideNow()) {
          let rideId = probabilities.getNextRide(visitors[i].age)
          let rideIdPadded = 'ride-' + pad(rideId,3)
          visitors[i].lastActionIteration = totalMin
          visitors[i].totalRides++
          visitors[i].rideHistory.push({
            rideId: rideIdPadded,
            rideTime: timeNow
          })
          await dispatch.addToBatch({
            "event:": "Ride", 
            "rideId": rideIdPadded,
            "rating": probabilities.getRideRating(visitors[i].age, rideId, hour),
            "timestamp": timeNow,
            "visitorId": visitors[i].id,
            "visitor": Visitor.getVisitor(visitors[i])
          })          
          totals.rides++
          // console.log(`Visitor ${visitors[i].id} on ride-${NextRideId}`)
        }
      }
    }

    // Visitors leaving
    // Check visitors against leavingIteration - remove if same
    for (let i = 0; i < visitors.length; i++) {
      // Visitors leaving
      if (visitors[i].leavingIteration === totalMin) {
        // console.log(`Visitor ${visitors[i].id} leaving`)
        totals.exits++
        await dispatch.addToBatch({
          "event:": "Exit", 
          "rideId": null,
          "rating": null,          
          "timestamp": timeNow,
          "visitorId": visitors[i].id,
          "visitor": Visitor.getVisitor(visitors[i])
        })
      }
    }

    // Remove from array
    visitors = visitors.filter((visitor) => totalMin !== visitor.leavingIteration)
    
    console.log(`Time: ${timeNow} Hour: ${hour} Min: ${min} Total mins: ${totalMin} In park: ${visitors.length} Exits: ${totals.exits} TotalRides: ${totals.rides}`)
    totalMin++
  }

  // Clear out final messages
  dispatch.flushBatch()

  console.log('Simulation finished: ', JSON.stringify(totals, null, 0))
  console.timeEnd("main")
}

module.exports = { main }
