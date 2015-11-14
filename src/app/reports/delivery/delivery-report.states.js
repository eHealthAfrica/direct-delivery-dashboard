'use strict'

angular.module('reports')
  .config(function ($stateProvider) {
    $stateProvider.state('reports.layout.delivery', {
      url: '/delivery',
      data: {
        label: 'Reports'
      },
      templateUrl: 'app/reports/delivery/delivery-report.html',
      controller: 'DeliveryReportCtrl',
      controllerAs: 'devRepCtrl'
    })
  })
