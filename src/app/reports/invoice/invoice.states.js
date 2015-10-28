'use strict'

angular.module('reports')
  .config(function ($stateProvider) {
    $stateProvider.state('reports.layout.invoice', {
      parent: 'reports.layout',
      url: '/invoice',
      templateUrl: 'app/reports/invoice/invoice.html',
      controller: 'ReportsAllCtrl',
      controllerAs: 'reportsAllCtrl',
      resolve: {
        deliveryRounds: function (reportsService, log) {
          return reportsService.getDeliveryRounds()
            .catch(function (reason) {
              log.error('invoiceRoundListErr', reason)
              return {}
            })
        }
      }
    })
  })
