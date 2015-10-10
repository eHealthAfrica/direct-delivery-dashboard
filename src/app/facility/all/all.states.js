'use strict';

angular.module('facility')
  .config(function($stateProvider) {
    $stateProvider.state('facility.layout.all', {
      url: '',
      templateUrl: 'app/facility/all/all.html',
      controller: 'FacilityAllCtrl',
      controllerAs: 'facAllCtrl',
      data: {
        label: 'Facility'
      }
    });
  });
