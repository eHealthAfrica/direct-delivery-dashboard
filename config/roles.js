'use strict'

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

  function addPrefix (role) {
    return prefix + '_' + role
  }

  function accumilate (collection, key) {
    var group = roles[key]
    group.roles = group.roles.map(addPrefix)
    collection[key] = group
    return collection
  }

  return Object.keys(roles).reduce(accumilate, {})
}
