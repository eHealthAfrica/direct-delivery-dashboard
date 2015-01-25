'use strict';

angular.module('reports')
  .config(function($stateProvider) {
    $stateProvider.state('reports.all', {
      url: '',
      templateUrl: 'app/reports/all/all.html',
      controller: 'ReportsAllCtrl',
      controllerAs: 'reportsAllCtrl',
      data: {
        label: 'Reports'
      }
    });
  });
