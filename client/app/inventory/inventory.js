'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/inventory', {
        templateUrl: 'app/inventory/inventory.html',
        controller: 'InventoryCtrl',
        authenticate: true
      });
  });