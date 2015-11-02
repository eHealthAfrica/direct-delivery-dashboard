'use strict'

angular.module('facility')
  .service('facilityService', function (
    $q,
    log,
    dbService,
    pouchUtil,
    authService
  ) {
    var _this = this

    function getGrouped (group, type, row) {
      if (!group.hasOwnProperty(type)) {
        group[type] = {}
      }
      group = groupByZone(group, row, type)
      group = groupByLGA(group, row, type)
      group = groupByWard(group, row, type)

      return group
    }

    function groupByWard (group, row, type) {
      if (type === 'ward' && !group[type][row.zone][row.lga].hasOwnProperty(row.ward)) {
        group[type][row.zone][row.lga][row.ward] = []
      }

      if (type === 'ward') {
        group[type][row.zone][row.lga][row.ward] = updateGroup(group[type][row.zone][row.lga][row.ward], row)
      }

      return group
    }

    function groupByLGA (group, row, type) {
      if (type === 'ward' && !group[type][row.zone].hasOwnProperty(row.lga)) {
        group[type][row.zone][row.lga] = {}
      }

      if (type === 'lga') {
        group[type][row.zone][row.lga] = updateGroup(group[type][row.zone][row.lga], row)
      }
      return group
    }

    function groupByZone (group, row, type) {
      if (!group[type].hasOwnProperty(row.zone) && type !== 'zone') {
        group[type][row.zone] = {}
      }
      if (type === 'zone') {
        group[type][row.zone] = updateGroup(group[type][row.zone], row)
      }
      return group
    }

    function updateGroup (group, row) {
      if (!angular.isArray(group)) {
        group = []
      }
      group.push(row)
      return group
    }

    function groupByLevel (locations) {
      var i = locations.length
      var locationLevel = {
        zone: {},
        lga: {},
        ward: {},
        facility: {}
      }
      while (i--) {
        if (parseInt(locations[i].level, 10) === 6) {
          locationLevel.facility[locations[i]._id] = locations[i]
        }
        if (parseInt(locations[i].level, 10) === 5) {
          locationLevel.ward[locations[i]._id] = locations[i]
        }
        if (parseInt(locations[i].level, 10) === 4) {
          locationLevel.lga[locations[i]._id] = locations[i]
        }
        if (parseInt(locations[i].level, 10) === 3) {
          locationLevel.zone[locations[i]._id] = locations[i]
        }
      }

      return locationLevel
    }

    function getCCEStatus (cceStatus) {
      var status = {
        date: null,
        status: true
      }
      if (angular.isDefined(cceStatus) && angular.isArray(cceStatus)) {
        cceStatus.sort(function (a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        status.date = cceStatus[0].date
        status.status = cceStatus[0].status
      }

      return status
    }

    function collate (locations) {
      var i = locations.length
      var locationLevel = groupByLevel(locations)
      var facilities = []
      var zone = {}
      var lga = {}
      var ward = {}
      while (i--) {
        if (parseInt(locations[i].level, 10) === 6) {
          var facility = angular.copy(locations[i])
          var cceStatus = getCCEStatus(facility.cceStatus)
          var ancestors = facility.ancestors.reverse()
          facility.zone = locationLevel.zone[ancestors[2]] ? locationLevel.zone[ancestors[2]].name : ''
          facility.lga = locationLevel.lga[ancestors[1]] ? locationLevel.lga[ancestors[1]].name : ''
          facility.ward = locationLevel.ward[ancestors[0]] ? locationLevel.ward[ancestors[0]].name : ''
          facility.status = cceStatus
          facilities.push(facility)
          zone = getGrouped(zone, 'zone', facility)
          lga = getGrouped(lga, 'lga', facility)
          ward = getGrouped(ward, 'ward', facility)
        }
      }
      return {
        facilities: facilities,
        locations: locationLevel,
        nestedFacilities: angular.merge({}, zone, lga, ward)
      }
    }

    _this.getStateLocations = function (state) {
      state = state || 'KN'
      var view = 'location/by-ancestors-id'
      var params = {
        startkey: state,
        endkey: state,
        include_docs: true
      }

      function branchByUser (user) {
        if (user.isAdmin()) {
          return
        }
        var states = authService.authorisedStates(user)
        if (states.indexOf(state) !== -1) {
          return
        }
        log.error('unauthorizedAccess')
        return $q.reject('unauthorized')
      }

      return authService.getCurrentUser()
        .then(branchByUser)
        .then(dbService.getView.bind(null, view, params))
        .then(pouchUtil.pluckDocs)
        .then(collate)
    }

    _this.save = function (report) {
      return dbService.save(report)
    }
  })
