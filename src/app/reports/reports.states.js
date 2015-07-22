'use strict';

angular.module('configurations')
    .config(function ($stateProvider) {
      $stateProvider
          .state('reports', {
            parent: 'index',
            url: '/reports',
            templateUrl: 'app/reports/index.html',
            controller: function ($state) {
              $state.go('reports.layout.delivery')
            },
            data: {
              label: 'Reports'
            }
          })
          .state('reports.layout', {
            parent: 'reports',
            views: {
              "menu": {
                templateUrl: 'app/reports/menu/menu.html'
              },
              "reports.content": {}
            }
          });
    });
