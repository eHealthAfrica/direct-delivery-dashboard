/**
 * Created by ehealthafrica on 7/3/15.
 */

angular.module('allocations')
  .config(function($stateProvider){
    $stateProvider.state('configurations.allocations', {
      parent: 'configurations.layout',
      url : '/allocations',
      templateUrl: 'app/configurations/allocations/index.html'
    })
  });