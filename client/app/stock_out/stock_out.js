'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/stock-out', {
        templateUrl: 'app/stock_out/stock_out.html',
        controller: 'StockOutCtrl',
        authenticate: true
      });
  });