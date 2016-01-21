'use strict'

angular.module('configurations.facilities')
  .controller('ConfigFacilityListCtrl', function (
    authService,
    dbService,
    log,
    states,
    selectedStateId,
    locationService,
    $scope,
    pouchUtil) {
    var vm = this

    vm.states = states
    vm.selectedStateId = selectedStateId

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
      stateId = stateId || vm.selectedStateId
      return vm.getLgas(stateId)
        .then(vm.getFacilities)
        .catch(function (err) {
          vm.facilities = []
          vm.lgas = []
          log.info('facilitiesRetrievalErr', err)
        })
    }

    vm.save = function (data, facility) {
      return dbService.update(angular.extend(facility, data))
        .then(function (response) {
          log.success('locationSaveSuccess', response)
          return response
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
        })
    }

    vm.switchState()
    $scope.$on('stateChanged', function (event, data) {
      var state = data.state
      vm.selectedStateId = state._id
      vm.switchState()
    })
  })
