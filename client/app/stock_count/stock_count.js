'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/stock-count', {
        templateUrl: 'app/stock_count/stock_count.html',
        controller: 'StockCountCtrl'
      });
  });