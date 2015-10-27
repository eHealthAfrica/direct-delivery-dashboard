'use strict'

angular.module('allocations')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configurations.allocations.assumptions', {
        parent: 'configurations.allocations',
        url: '/assumptions',
        templateUrl: 'app/configurations/allocations/assumptions/assumptions.html',
        controller: 'AssumptionsCtrl',
        controllerAs: 'assumptionsCtrl',
        resolve: {
          assumptionList: function (assumptionService) {
            return assumptionService.getAll()
              .catch(function () {
                return []
              })
          }
        }
      })
      .state('configurations.allocations.assumptions.preview', {
        url: '/preview',
        parent: 'configurations.allocations.assumptions',
        templateUrl: 'app/configurations/allocations/assumptions/preview.html',
        controller: 'AssumptionController',
        controllerAs: 'assumptionController',
        resolve: {
          assumptionList: function (assumptionService) {
            return assumptionService.getAll()
              .catch(function (error) {
                console.error(error)
                return []
              })
          }
        }
      })
      .state('configurations.allocations.allocationView', {
        url: '/view/:id',
        parent: 'configurations.allocations',
        templateUrl: 'app/configurations/allocations/assumptions/assumption-template/edit-template/edit-template.html',
        controller: 'AllocationValuesController',
        controllerAs: 'allocationValCtrl',
        resolve: {
          data: function ($stateParams, assumptionService) {
            return assumptionService.get($stateParams.id)
              .catch(function () {
                return []
              })
          }
        }
      })
  })
