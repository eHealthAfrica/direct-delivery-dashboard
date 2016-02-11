'use strict'

angular.module('configurations.facilities')
  .service('configFacilityService', function (
    dbService,
    locationService,
    utility,
    pouchUtil,
    $q
  ) {
    function filterActive (list) {
      list = list || []
      var i = list.length
      var activeFacilities = []
      if (i > 0) {
        while (i--) {
          var row = list[i]
          if (row.hasOwnProperty('active') && row.active === true) {
            activeFacilities.unshift(row)
          }

          if (!row.hasOwnProperty('active')) {
            activeFacilities.unshift(row)
          }
        }
      }

      return activeFacilities
    }

    this.save = function (data, facility) {
      return dbService.update(angular.extend(facility, data))
    }

    this.getLGAs = function (stateId) {
      var keys = []
      keys.push(['4', stateId])
      return locationService.getByLevelAndAncestor(keys)
        .then(pouchUtil.rejectIfEmpty)
    }

    this.getFacilities = function (lgaId) {
      var keys = []
      keys.push(['6', lgaId])
      return locationService.getByLevelAndAncestor(keys)
        .then(pouchUtil.rejectIfEmpty)
        .then(filterActive)
    }

    this.remove = function (facility) {
      if (facility && !utility.isEmptyObject(facility)) {
        facility.active = false
        return dbService.update(facility)
      }
      return $q.reject(facility)
    }
  })
