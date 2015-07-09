/**
 * Created by ehealthafrica on 7/6/15.
 */

angular.module('allocations')
  .config(function ($stateProvider){
    $stateProvider.state('configurations.allocations.assumptions', {
      parent: 'configurations.allocations',
      url: '/assumptions',
      templateUrl: 'app/configurations/allocations/assumptions/assumptions.html',
      controller: "AssumptionsController",
      controllerAs: 'assumptionsController',
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