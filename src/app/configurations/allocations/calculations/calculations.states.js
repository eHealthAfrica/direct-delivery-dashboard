'use strict'

angular.module('allocations')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configurations.allocations.calculations', {
        parent: 'configurations.allocations',
        url: '/calculations',
        templateUrl: 'app/configurations/allocations/calculations/index.html',
        controller: 'CalculationsController',
        controllerAs: 'calculationsController',
        resolve: {
          products: function (productService) {
            return productService.getAll()
              .catch(function () {
                return []
              })
          },
          locations: function (locationService) {
            return locationService.getLocationsByLevel()
              .catch(function () {
                return []
              })
          },
          assumptionList: function (assumptionService) {
            return assumptionService.getAll()
              .catch(function () {
                return []
              })
          }
        }
      })
  })
