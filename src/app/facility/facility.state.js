'use strict'

angular.module('facility')
  .config(function ($stateProvider) {
    $stateProvider
      .state('facility', {
        abstract: true,
        parent: 'index',
        url: '/facility',
        templateUrl: 'app/facility/facility.html'
      })
      .state('facility.layout', {
        abstract: true,
        views: {
          menu: {
            templateUrl: 'app/facility/menu/menu.html'
          },
          'facility.content': {}
        }
      })
  })
