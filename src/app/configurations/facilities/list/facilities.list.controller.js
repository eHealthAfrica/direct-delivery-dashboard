'use strict'

angular.module('configurations.facilities')
  .controller('ConfigFacilityListCtrl', function (authService, log, states, locationService, pouchUtil) {
    var vm = this

    vm.states = states
    vm.authState = false
    vm.getLgas = function (stateId) {
      var keys = []
      keys.push(['4', stateId])
      return locationService.getByLevelAndAncestor(keys)
        .then(pouchUtil.rejectIfEmpty)
        .then(function (response) {
          if (angular.isArray(response)) {
            if (response.length > 0) {
              vm.lgas = response
              vm.selectedLga = vm.lgas[0]
              return vm.selectedLga._id
            }
          }
        })
    }
    vm.getFacilities = function (lgaId) {
      var keys = []
      keys.push(['6', lgaId])
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.facilities = response
          return response
        })
    }
    vm.switchState = function (stateId) {
      return vm.getLgas(stateId)
        .then(vm.getFacilities)
        .catch(function (err) {
          log.error('facilitiesRetrivalErr', err)
        })
    }

    authService.getCurrentUser()
      .then(authService.authorisedStates)
      .then(function (response) {
        vm.selectedStateId = response[0]
        vm.authState = vm.selectedStateId
        return vm.selectedStateId
      })
      .then(vm.switchState)
      .catch(function (err) {
        log.error('facilitiesRetrivalErr', err)
      })
  })
