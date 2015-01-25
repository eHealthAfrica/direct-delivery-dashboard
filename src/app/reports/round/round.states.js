'use strict';

angular.module('reports')
  .config(function($stateProvider) {
    $stateProvider.state('reports.round', {
      url: '/round/:id',
      templateUrl: 'app/reports/round/round.html',
      controller: 'ReportsRoundCtrl',
      controllerAs: 'reportsRoundCtrl',
      resolve: {
        dailyDeliveries: function($stateParams, reportsService) {
          return reportsService.getDailyDeliveries($stateParams.id);
        }
      }
    });
  });
