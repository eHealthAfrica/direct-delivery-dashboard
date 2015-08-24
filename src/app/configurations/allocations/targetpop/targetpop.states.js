/**
 * Created by ehealthafrica on 8/21/15.
 */


angular.module('allocations')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.allocations.targetpop', {
        parent: 'configurations.allocations',
        url: '/target-populations',
        templateUrl: "app/configurations/allocations/targetpop/list.html",
        controller: 'TargetPopulationsController as targetPopCtrl',
        resolve: {
          locations : function(locationService){
            return locationService.getLocationsByLevel()
              .catch(function(err){
                return [];
              });
          }

        }
      })
  });