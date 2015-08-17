/**
 * Created by ehealthafrica on 7/10/15.
 */

angular.module('allocations')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.allocations.calculations', {
        parent: 'configurations.allocations',
        url: '/calculations',
        templateUrl: 'app/configurations/allocations/calculations/index.html',
        controller: 'CalculationsController',
        controllerAs: 'calculationsController',
        resolve: {
          products : function(productService){
            return productService.getAll()
              .catch(function(err){
                return [];
              });
          },
          locations : function(locationService){
            return locationService.getLocationsByLevel()
              .catch(function(err){
                return [];
              });
          },
          assumptionList : function(assumptionService){
            return assumptionService.getAll()
              .catch(function(err){
                return []
              });
          }
        }
      })
  });