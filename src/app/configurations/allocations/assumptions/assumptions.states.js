/**
 * Created by ehealthafrica on 7/6/15.
 */

angular.module('allocations')
  .config(function ($stateProvider){
    $stateProvider.state('configurations.allocations.assumptions', {
      parent: 'configurations.allocations',
      url: '/assumptions',
      templateUrl: 'app/configurations/allocations/assumptions/assumptions.html',
      controller: 'AssumptionsCtrl',
      controllerAs: 'assumptionsCtrl',
      resolve: {
        assumptionList : function(assumptionService){
          return assumptionService.getAll()
            .catch(function(err){
              return []
            });
        }
      }
    })
    .state('configurations.allocations.assumptions.preview', {
      url: '/preview',
      templateUrl: 'app/configurations/allocations/assumptions/preview.html',
      controller: "AssumptionController",
      controllerAs: 'assumptionController',
      resolve: {
        assumptionList : function(assumptionService){
          return assumptionService.getAll()
            .catch(function(err){
              return []
            });
        }
      }
    })
  });