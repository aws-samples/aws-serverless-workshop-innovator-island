// Libraries

const Chance = require('chance')
const chance = new Chance()
const { getRandomPoint } = require('./geo')

/* Because this is a simulation for a workshop, we need the "random"
   data to have patterns so they are discoverable in the analysis part
   of the workshop. This file contains the probalities calculations
   that perform this.
*/

// getHomeLocation()
// Get home location of visitor
// Uses multiple centers for visitors, and calculates a geo-point with
// a bias towards the center.

const centers = [
  {
    latitude: 41.494115,
    longitude: -89.740871
  },
  {
    latitude: 36.986245,
    longitude: -85.261893
  },
  {
    latitude: 30.151029,
    longitude: -98.163200
  },
  {
    latitude: 38.594172,
    longitude: -104.686025
  },
  {
    latitude: 46.365834,
    longitude: -120.471124
  },
  {
    latitude: 33.720876,
    longitude: -84.344066
  }      
]
const R = [1000000, 633000, 239387, 526064, 247228, 350536]  // meters 

const getHomeLocation = () => {
  let locationNum = chance.integer({ min: 0, max: 5 })
  // console.log(locationNum, centers[locationNum], R[locationNum])
  return getRandomPoint(centers[locationNum], R[locationNum])
}

// doesVisitorArrive()
// Does visitor arrive now?
// Uses probabilities/by hour to determine if a visitor will arrive.
const probs_hours_arriving = {1: 30, 2: 25, 3: 20, 4: 5, 5: 1, 6: 2, 7: 3, 8: 2, 9: 1, 10: 1, 11: 0, 12: 0}
const doesVisitorArrive = (hour) => chance.bool({likelihood: probs_hours_arriving[hour]})

// getVisitorAge()
// When a visitor is created, this decides their age based upon a age tier
// distribution, then a range spreader is applied to add a little noise.
const probs = [{15 : 100}, {20 : 90}, {25 : 50}, {30 : 70}, {45 : 20}, {50 : 10}, {65 : 15}, {70 : 5}, {80 : 2}]
let allProbs = []

probs.forEach(function(obj, index) {
  for (let key in obj) {
    for (let loop = 0; loop < obj[key]; loop ++) {
      allProbs.push(key)
    }
  }
})

const getVisitorAge = () => parseInt(allProbs[Math.floor(Math.random() * allProbs.length)])

// getBirthday()
//  - returns month/day. Ignores leap years
const getBirthday = () => {
  let month = chance.integer({ min: 1, max: 12 })
  let maxDays = 31
  if ([4, 6, 9, 11].includes(month)) maxDays = 30
  if (month === 2) maxDays = 28
  return {
    month,
    day: chance.integer({ min: 1, max: maxDays })
  }
}

// getLeavingIteration()
// When a visitor is created, this decides when they will leave the park.
// The simulation will remove the visitor when it arrives at this time.

// Length of visit is determined by visitor age
const probs_howLong = [[15, 600], [20, 500], [25, 400], [30, 350], [45, 300], [50, 250], [65, 180], [70, 150], [1000, 120]]

const getLeavingIteration = (arrivingIteration, age) => {
  for (let i = 0; i < probs_howLong.length; i++) {
    if (age < probs_howLong[i][0]) {
      let mean = probs_howLong[i][1] + arrivingIteration
      return chance.integer({ min: mean-20, max: mean+20 })
    }
  }
}

// getNextRide()
// When the simulator prompts for the next ride, this picks one
// based on the visitor's age.

// Matrix of ages and probabilities by ride ID
const probs_nextRide = [
                          [10, [2,5,2,10,2,10,5,12,1,15,5,5,15,3,3,5]],
                          [18, [5,8,8,2,8,2,6,1,8,2,9,7,2,10,10,12]],
                          [25, [15,5,15,0,15,0,7,0,15,0,5,7,0,5,6,5]],
                          [30, [16,7,16,0,17,0,6,0,10,0,10,5,0,5,3,5]],
                          [45, [5,5,5,10,5,10,5,10,5,8,5,5,10,5,2,5]],
                          [60, [1,15,1,5,0,6,5,5,0,14,2,4,2,10,10,20]],
                          [100, [0,10,0,1,0,1,5,0,0,8,20,5,20,5,15,10]]
                       ]

const getNextRide = (age) => {

  const getRideId = (index) => {
    // console.log('getRideId: ', index)
    let allProbs_nextRide = []
  
    for (let i = 0; i < probs_nextRide[index][1].length; i++) {
      // console.log(i, probs_nextRide[index][1][i])
      for (let loop = 0; loop < probs_nextRide[index][1][i]; loop ++) {
        allProbs_nextRide.push(i+1)
      }    
    }
  
    return parseInt(allProbs_nextRide[Math.floor(Math.random() * allProbs_nextRide.length)])
  }

  for (let i = 0; i < probs_nextRide.length; i++) {
    // console.log('x', probs_nextRide[i])
    if (age < probs_nextRide[i][0]) {
      // console.log(i, age, probs_nextRide[i][0])
      return getRideId(i)
    }
  }
}

// getRideRating()
// How much the visitor liked the ride (1-5). Result is skewed by age, 
// ride type and type of day (later in the day = more random)

// Matrix of ages and probabilities by ride ID

const probs_rideRating = [
                          [10, [2,5,1,5,1,5,5,5,1,5,4,3,5,3,4,4,3]],
                          [18, [5,3,5,1,5,3,5,4,3,5,5,3,5,5,5,5,4]],
                          [25, [5,4,5,2,5,3,5,3,4,5,4,4,4,5,5,5,4]],
                          [30, [4,4,5,4,5,3,3,3,5,5,4,4,4,4,4,4,4]],
                          [45, [3,5,5,5,4,3,3,3,4,4,4,4,3,4,4,4,5]],
                          [60, [1,5,3,5,3,2,5,5,3,4,5,5,5,5,5,5,4]],
                          [100, [1,4,1,3,3,2,5,5,1,4,4,5,5,3,3,3,3]]
                       ]

const getRideRating = (age, rideId, hour) => {

  let meanRating = 1

  for (let i = 0; i < probs_rideRating.length; i++) {
    // console.log('x', probs_nextRide[i])
    if (age <= probs_rideRating[i][0]) {
      meanRating = probs_rideRating[i][1][rideId]
      // console.log(i, age, probs_rideRating[i][1],rideId,meanRating)
      if (chance.bool({likelihood: 20 + (hour * 2)})) {
        // console.log('Role the die')
        return chance.integer({ min: 1, max: 5 })
      } else {
        // console.log('Use ratings matrix: ', Math.max(1, meanRating-1), Math.min(5, meanRating+1) )
        return chance.integer({ min: Math.max(1, meanRating-1), max: Math.min(5, meanRating+1)})
      }      
    }
  }
}

// rideNow()
// When a visitor is ready to ride, this decide if they will
// (there is an x% chance).

const likelihood_of_riding = 10
const rideNow = () => {
  return chance.bool({ likelihood: likelihood_of_riding })
}

// Exports
module.exports = { 
  getHomeLocation,
  doesVisitorArrive, 
  getVisitorAge,
  getBirthday,
  getLeavingIteration,
  getNextRide,
  getRideRating,
  rideNow
}
