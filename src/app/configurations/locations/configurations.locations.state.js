'use strict'

angular.module('configurations.locations')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.locations', {
      parent: 'configurations.layout',
      url: '/locations',
      templateUrl: 'app/configurations/locations/layout.html',
      controller: 'ConfigurationsLocationsCtrl as configLocationCtrl'
    })
      .state('configurations.locations.zones', {
        parent: 'configurations.layout',
        url: '/zones',
        controller: 'ConfigurationsLocationsZonesCtrl as locationZonesCtrl',
        templateUrl: 'app/configurations/locations/layout.html'
      })
      .state('configurations.locations.lgas', {
        parent: 'configurations.layout',
        url: '/lgas',
        controller: 'ConfigurationsLocationsLgasCtrl as locationLgasCtrl',
        templateUrl: 'app/configurations/locations/lgas/index.html'
      })
      .state('configurations.locations.wards', {
        parent: 'configurations.layout',
        url: '/wards',
        controller: 'ConfigurationsLocationsWardsCtrl as locationWardsCtrl',
        templateUrl: 'app/configurations/locations/wards/index.html'
      })
  })
