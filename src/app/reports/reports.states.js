'use strict';

angular.module('configurations')
    .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
      $stateProvider
          .state('reports', {
            parent: 'index',
            url: '/reports',
            templateUrl: 'app/reports/index.html',
            controller: function ($state) {
              $state.go('reports.layout.delivery');
            },
            data: {
              label: 'Reports'
            },
            resolve: {
              authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser,
              authorization: function(authService) {
                return authService.requireRoles([
                  'direct_delivery_dashboard_accounting',
                  'direct_delivery_dashboard_stakeholder'
                ]);
              }
            }
          })
          .state('reports.layout', {
            parent: 'reports',
            views: {
              menu: {
                templateUrl: 'app/reports/menu/menu.html'
              },
              'reports.content': {}
            }
          });
    });
