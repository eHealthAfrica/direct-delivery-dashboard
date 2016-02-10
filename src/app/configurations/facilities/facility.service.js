'use strict'

angular.module('configurations.facilities')
  .service('configFacilityService', function (
    dbService,
    locationService,
    utility,
    pouchUtil,
    $q
  ) {
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
    }

    this.remove = function (facility) {
      if (facility && !utility.isEmptyObject(facility)) {
        facility._deleted = true
        return dbService.update(facility)
      }
      return $q.reject(facility)
    }
  })
