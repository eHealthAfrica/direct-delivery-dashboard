'use strict'

angular.module('configurations.locations')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.locations', {
      parent: 'configurations.layout',
      url: '/locations',
      templateUrl: 'app/configurations/locations/layout.html',
      controller: 'ConfigurationsLocationsCtrl as configLocationCtrl',
    })
      .state('configurations.locations.state', {

      })
  })
