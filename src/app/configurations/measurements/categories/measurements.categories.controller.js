'use strict'

angular.module('Measurements')
  .controller('MeasurementCategoriesCtrl', function (measurementService, categories, log, $rootScope) {
    var vm = this

    vm.categories = categories
    vm.openedDoc = {}

    vm.save = function () {
      measurementService.save(vm.openedDoc)
        .then(function (response) {
          vm.categories.push(angular.extend({}, vm.openedDoc, response))
          $rootScope.$broadcast('newCategoryAdded', vm.openedDoc)
          vm.openedDoc = {}
          return log.success('', '', 'measurement category saved successfully')
        })
        .catch(function (err) {
          return log.error('', err, 'saving measurement category failed')
        })
    }
  })
