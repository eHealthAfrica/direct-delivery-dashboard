'use strict'

angular.module('facility')
  .service('facilityService', function ($q, dbService, pouchUtil) {
    var _this = this

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
        }
      }
      return {
        facilities: facilities,
        locations: locationLevel
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
      return dbService.getView(view, params)
        .then(pouchUtil.pluckDocs)
        .then(collate)
    }

    _this.save = function (report) {
      return dbService.save(report)
    }
  })
