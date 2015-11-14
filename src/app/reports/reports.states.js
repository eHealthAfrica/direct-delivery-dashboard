'use strict'

angular.module('configurations')
  .config(function ($stateProvider, authProvider) {
    $stateProvider
      .state('reports', {
        abstract: true,
        parent: 'index',
        url: '/reports',
        templateUrl: 'app/reports/index.html',
        data: {
          roles: [
            'direct_delivery_dashboard_accounting',
            'direct_delivery_dashboard_stakeholder'
          ]
        },
        resolve: {
          authentication: authProvider.requireAuthenticatedUser,
          authorization: authProvider.requireUserWithRoles([
            'direct_delivery_dashboard_accounting',
            'direct_delivery_dashboard_stakeholder'
          ])
        }
      })
      .state('reports.layout', {
        abstract: true,
        views: {
          menu: {
            templateUrl: 'app/reports/menu/menu.html'
          },
          'reports.content': {}
        }
      })
  })
