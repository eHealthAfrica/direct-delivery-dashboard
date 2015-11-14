'use strict'

angular.module('configurations')
  .config(function (
    $stateProvider,
    authProvider
  ) {
    $stateProvider
      .state('configurations', {
        parent: 'index',
        abstract: true,
        url: '/configurations',
        templateUrl: 'app/configurations/index.html',
        data: {
          roles: [
            'direct_delivery_dashboard_super'
          ]
        },
        resolve: {
          authentication: authProvider.requireAuthenticatedUser,
          authorization: authProvider.requireAdminUser
        }
      })
      .state('configurations.layout', {
        abstract: true,
        views: {
          'menu': {
            templateUrl: 'app/configurations/menu/menu.html'
          },
          'configurations.content': {}
        }
      })
  })
