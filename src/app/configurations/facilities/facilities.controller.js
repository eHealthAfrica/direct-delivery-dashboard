angular.module('configurations.facilities')
  .controller('FacilitiesCtrl', function ($state) {
    var vm = this
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
    $state.go('configurations.facilities.list')
  })
