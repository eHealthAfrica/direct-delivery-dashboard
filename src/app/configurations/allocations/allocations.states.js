'use strict'

angular.module('allocations')
  .config(function ($stateProvider) {
    $stateProvider.state('configurations.allocations', {
      abstract: true,
      parent: 'configurations.layout',
      url: '/allocations',
      templateUrl: 'app/configurations/allocations/index.html'
    })
  })
