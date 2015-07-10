/**
 * Created by ehealthafrica on 7/10/15.
 */

angular.module('allocations')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.allocations.calculations', {
        parent: 'conigurations.allocations',
        url: '/calculations',
        templateUrl: 'app/configurations/allocations/calculations/index.html',

      })
  });