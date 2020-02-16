
// Libraries
const Chance = require('chance')
const chance = new Chance()
const faker = require('faker')
const probabilities = require('./probabilities')

// Globals
const MAX_MINS = (60 * 12)  // 12 hrs of park opening time

// Creates a new visitor profile
const createVisitor = (id, arrivalTime, arrivalIteration) => {
  const age = probabilities.getVisitorAge()
  return {
    id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age,
    birthday: probabilities.getBirthday(),
    home: probabilities.getHomeLocation(),
    arrivalTime,
    arrivalIteration,
    leavingIteration: Math.min(probabilities.getLeavingIteration(arrivalIteration, age), MAX_MINS),
    lastActionIteration: arrivalIteration,
    totalRides: 0,
    rideHistory: []
  }
}

// Strips out internal attributes from visitor object
const getVisitor = (visitor) => {
  return {
    id: visitor.id,
    firstName: visitor.firstName,
    lastName: visitor.lastName,
    age: visitor.age,
    birthday: visitor.birthday,
    home: visitor.home,
    arrivalTime: visitor.arrivalTime,
    totalRides: visitor.totalRides
  }
}

// Exports
module.exports = { createVisitor, getVisitor }