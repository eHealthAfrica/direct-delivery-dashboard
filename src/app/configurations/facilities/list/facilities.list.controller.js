'use strict'

angular.module('configurations.facilities')
  .controller('ConfigFacilityListCtrl', function (
    log,
    states,
    selectedStateId,
    $scope,
    configFacilityService
  ) {
    var vm = this

    vm.states = states
    vm.selectedStateId = selectedStateId

    vm.getLgas = function (stateId) {
      return configFacilityService.getLGAs(stateId)
        .then(function (response) {
          var lgaID
          if (angular.isArray(response) && response.length > 0) {
            vm.lgas = response
            vm.selectedLga = vm.lgas[0]
            lgaID = vm.lgas[0]._id
          }
          return lgaID
        })
        .catch(function (err) {
          log.info('facilitiesRetrievalErr', err)
          return []
        })
    }
    vm.getFacilities = function (lgaId) {
      if (!lgaId) {
        vm.facilities = []
        return
      }
      return configFacilityService.getFacilities(lgaId)
        .then(function (response) {
          vm.facilities = response
          return response
        })
        .catch(function (err) {
          vm.facilities = []
          log.info('facilitiesRetrievalErr', err)
          return []
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
          return []
        })
    }

    vm.save = function (data, facility) {
      configFacilityService.save(data, facility)
        .then(function (response) {
          log.success('locationSaveSuccess', response)
          return response
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
          return []
        })
    }

    vm.remove = function (facility) {
      return configFacilityService.remove(facility)
        .then(function (response) {
          log.success('locationSaveSuccess', response)
          vm.getFacilities(vm.selectedLga._id)
          return response
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
          return err
        })
    }

    vm.switchState()
    $scope.$on('stateChanged', function (event, data) {
      var state = data.state
      vm.selectedStateId = state._id
      vm.switchState()
    })
  })
