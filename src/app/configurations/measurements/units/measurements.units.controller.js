'use strict';

angular.module('Measurements')
  .controller('MeasurementUnitsCtrl', function(units, categories, measurementsUnitService, log){
    var vm = this;

    vm.units = units;
    vm.categories = categories;

    vm.openedDoc = {};

    console.log(vm.categories);

    vm.save = function(){
      return measurementsUnitService.save(vm.openedDoc)
        .then(function(response){
          vm.units.push(angular.extend({}, vm.openedDoc, response));
          vm.openedDoc = {};
          return log.success('', '', 'measurement unit saved');
        })
    }

  });