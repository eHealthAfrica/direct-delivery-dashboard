'use strict'

angular.module('reports')
  .config(function ($stateProvider) {
    $stateProvider.state('reports.layout.packing', {
      parent: 'reports.layout',
      url: '/packing',
      templateUrl: 'app/reports/packing/packing-report.html',
      controller: 'PackingReportCtrl',
      controllerAs: 'packingRepCtrl'
    })
  })
