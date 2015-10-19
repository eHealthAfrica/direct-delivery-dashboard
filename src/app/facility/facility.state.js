'use strict'

angular.module('facility')
  .config(function ($stateProvider) {
    $stateProvider.state('facility', {
      abstract: true,
      parent: 'index',
      url: '/facility',
      controller: function ($state) {
        $state.go('facility.layout.reports')
      },
      data: {
        label: 'Facility'
      },
      templateUrl: 'app/facility/facility.html'
    })
    .state('facility.layout', {
      parent: 'facility',
      views: {
        menu: {
          templateUrl: 'app/facility/menu/menu.html'
        },
        'facility.content': {}
      }
    })
  })

