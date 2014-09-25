'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/ccu-breakdown', {
        templateUrl: 'app/ccu_breakdown/ccu_breakdown.html',
        controller: 'CCUBreakdownCtrl'
      });
  });