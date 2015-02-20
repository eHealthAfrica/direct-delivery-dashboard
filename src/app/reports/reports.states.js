'use strict';

angular.module('reports')
  .config(function($stateProvider) {
    $stateProvider.state('reports', {
      abstract: true,
      parent: 'index',
      url: '/reports',
      templateUrl: 'app/reports/reports.html',
      controller: 'ReportsCtrl',
      controllerAs: 'reportsCtrl',
      resolve: {
        deliveryRounds: function(reportsService) {
          return reportsService.getDeliveryRounds();
        }
      }
    });
  });
