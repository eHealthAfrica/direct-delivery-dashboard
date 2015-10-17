'use strict'

angular.module('Measurements')
  .controller('MeasurementUnitsCtrl', function (units, categories, measurementsUnitService, log, $scope, measurementService) {
    var vm = this

    vm.units = units
    vm.categories = categories

    vm.openedDoc = {}

    $scope.$on('newCategoryAdded', function (cat) {
      measurementService.getAll().then(function (cats) {
        vm.categories = cats
      }).catch(function () {
        vm.categories = []
      })
    })

    vm.save = function () {
      return measurementsUnitService.save(vm.openedDoc)
        .then(function (response) {
          vm.units.push(angular.extend({}, vm.openedDoc, response))
          vm.openedDoc = {}
          return log.success('', '', 'measurement unit saved')
        })
    }
  })
