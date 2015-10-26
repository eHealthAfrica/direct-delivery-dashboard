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
      url : '/zones',
      controller: 'ConfigurationsLocationsZonesCtrl as configLocationCtrl',
      templateUrl: 'app/configurations/locations/layout.html'
    })
    .state('configurations.locations.lgas', {
      parent: 'configurations.layout',
      url : '/lgas',
      controller: 'ConfigurationsLocationsLgasCtrl as configLocationCtrl',
      templateUrl: 'app/configurations/locations/lgas/index.html'
    })
  })
