angular.module('configurations.facilities')
  .controller('FacilitiesCtrl', function ($state) {
    var vm = this
    //vm.states = states
    //vm.selectedState = vm.states[0]
    vm.lgas = []
    vm.facilities = []
    vm.csvHeader = [
      'State',
      'Zone',
      'Lga',
      'Id',
      'Name',
      'Coord',
      'Type'
    ]
    vm.csvTemplateDownload = function () {
      return []
    }
    /*vm.getLgas = function (stateId) {
      var keys = []
      keys.push(['4', stateId])
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.lgas = response
          vm.selectedLga = vm.lgas[0]
          return vm.selectedLga._id
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
    vm.getLgas(vm.selectedState._id)
      .then(vm.getFacilities)*/
    $state.go('configurations.facilities.list')
  })
