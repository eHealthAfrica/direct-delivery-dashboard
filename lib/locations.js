'use strict'

var locations = require('../couchdb/fixtures/locations.json')
var locationLevels = require('../couchdb/fixtures/location-levels.json')

function findState () {
  function isState (locationLevel) {
    return locationLevel.name === 'State'
  }
  return locationLevels.docs.filter(isState)[0]
}

function locationsByLevel (level) {
  function isLevel (location) {
    return location.level === level
  }
  return locations.docs.filter(isLevel)
}

function pluckIds (locations) {
  function pluckId (location) {
    return location._id
  }
  return locations.map(pluckId)
}

exports.stateIds = function () {
  var levelDoc = findState()
  if (!levelDoc) {
    throw new Error('could not find state location level doc')
  }
  var states = locationsByLevel(levelDoc._id)
  return pluckIds(states)
}
