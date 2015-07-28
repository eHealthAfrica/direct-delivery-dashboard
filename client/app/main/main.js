'use strict';

angular.module('lmisApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          weeklyReport: ['Report', function (Report) {
            return Report.getWithin();
          }]
        }
      });
  });