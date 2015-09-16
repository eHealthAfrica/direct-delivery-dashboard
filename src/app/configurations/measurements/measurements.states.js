'use strict';

angular.module('Measurements')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.measurementsLayout', {
        parent: 'configurations.layout',
        abstract: true,
        templateUrl: 'app/configurations/measurements/layout.html'
      })
      .state('configurations.measurements', {
        parent: 'configurations.measurementsLayout',
        url: '/measurements',
        views: {
          categories: {
            templateUrl: 'app/configurations/measurements/categories/categories.html',
            controller: 'MeasurementCategoriesCtrl',
            controllerAs: 'measurementCateCtrl',
            resolve: {
              categories: function(measurementService){
                return measurementService.getAll()
                  .catch(function(err){
                    return [];
                  });
              }
            }
          },
          units: {
            templateUrl: 'app/configurations/measurements/units/units.html',
            controller: 'MeasurementUnitsCtrl',
            controllerAs: 'measurementUnitsCtrl',
            resolve: {
              units: function(measurementsUnitService){
                return measurementsUnitService.getAll()
                  .catch(function(err){
                    console.log(err);
                    return [];
                  });
              },
              categories: function(measurementService){
                return measurementService.getAll()
                  .catch(function(err){
                    return [];
                  });
              }
            }
          }
        }
      })
  });