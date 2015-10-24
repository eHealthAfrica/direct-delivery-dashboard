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
        }
      }
    })
  })
