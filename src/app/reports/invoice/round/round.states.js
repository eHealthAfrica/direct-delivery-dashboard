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
        drivers: function (driversService) {
          return driversService.all()
        },
        dailyDeliveries: function (reportsService, $stateParams, log) {
          return reportsService.getDailyDeliveries($stateParams.id, {limit: 10})
            .catch(function (reason) {
              log.error('invoiceDailyDeliveryErr', reason)
              return {}
            })
        }
      }
    })
  })
