'use strict'

angular.module('configurations')
  .config(function (
    $stateProvider,
    authProvider
  ) {
    $stateProvider.state('configurations', {
      parent: 'index',
      // abstract: true,
      url: '/configurations',
      templateUrl: 'app/configurations/index.html',
      controller: function ($state) {
        if ($state.current.name === 'configurations') {
          $state.go('configurations.allocations.assumptions')
        }
      },
      data: {
        label: 'Configurations',
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
        parent: 'configurations',
        views: {
          'menu': {
            templateUrl: 'app/configurations/menu/menu.html'
          },
          'configurations.content': {}
        }
      })
  })
