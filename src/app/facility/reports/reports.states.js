'use strict';

angular.module('facility')
  .config(function($stateProvider) {
    $stateProvider.state('facility.layout.reports', {
      url: '',
      templateUrl: 'app/facility/reports/reports.html',
      controller: 'FacilityReportsCtrl',
      controllerAs: 'facRepCtrl',
      data: {
        label: 'Facility'
      }
    });
  });
