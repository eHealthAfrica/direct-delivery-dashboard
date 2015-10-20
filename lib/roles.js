'use strict'

var locations = require('./locations')

module.exports = function () {
  var prefix = 'direct_delivery_dashboard'
  var roles = {
    admin: {
      roles: [
        'super'
      ]
    },
    user: {
      roles: [
        'accounting',
        'stakeholder',
        'gis'
      ]
    }
  }

  function states () {
    function formatState (state) {
      return 'state_' + state.toLowerCase()
    }
    return locations.stateIds().map(formatState)
  }

  function accumilate (collection, key) {
    function addPrefix (role) {
      return prefix + '_' + role
    }
    var group = roles[key]
    group.roles = group.roles.map(addPrefix)
    collection[key] = group
    return collection
  }

  roles.user.roles = roles.user.roles.concat(states())
  return Object.keys(roles).reduce(accumilate, {})
}
