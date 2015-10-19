'use strict'

angular.module('reports')
  .config(function ($stateProvider) {
    $stateProvider.state('reports.layout.round', {
      parent: 'reports.layout',
      url: '/round/:id',
      templateUrl: 'app/reports/invoice/round/round.html',
      controller: 'ReportsRoundCtrl',
      controllerAs: 'reportsRoundCtrl',
      resolve: {
        deliveryRounds: function (reportsService) {
          return reportsService.getDeliveryRounds()
        },
        dailyDeliveries: function ($stateParams, reportsService) {
          return reportsService.getDailyDeliveries($stateParams.id)
        },
        drivers: function (driversService) {
          return driversService.all()
        }
      }
    })
  })
