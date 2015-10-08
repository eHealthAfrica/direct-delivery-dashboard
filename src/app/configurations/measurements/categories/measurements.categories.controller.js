'use strict'

angular.module('Measurements')
  .controller('MeasurementCategoriesCtrl', function (measurementService, categories, log) {
    var vm = this

    vm.categories = categories
    vm.openedDoc = {}

    vm.save = function () {
      measurementService.save(vm.openedDoc)
        .then(function (response) {
          vm.categories.push(angular.extend({}, vm.openedDoc, response))
          return log.success('', '', 'measurement category saved successfully')
        })
        .catch(function (err) {
          return log.error('', err, 'saving measurement category failed')
        })
    }
  })
