/**
 * Created by ehealthafrica on 7/6/15.
 */

angular.module('allocations')
  .config(function ($stateProvider){
    $stateProvider.state('configurations.allocations.assumptions', {
      parent: 'configurations.allocations',
      url: '/assumptions',
      templateUrl: 'app/configurations/allocations/assumptions/assumptions.html'
    })
    .state('configurations.allocations.assumptions.preview', {
      url: '/preview',
      templateUrl: 'app/configurations/allocations/assumptions/preview.html',
      controller: "AssumptionsController",
      controllerAs: 'assumptionsController',
      resolve: {
        products : function(productService){
          return productService.getAll();
        }
      }
    })
  });