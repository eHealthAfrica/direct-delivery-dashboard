'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/stock-count-summary', {
        templateUrl: 'app/stock_count_summary/stock_count_summary.html',
        controller: 'StockCountSummaryCtrl',
        authenticate: true
      });
  });