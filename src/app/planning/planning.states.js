'use strict'

angular.module('planning')
  .config(function ($stateProvider, authProvider) {
    $stateProvider.state('planning', {
      abstract: true,
      parent: 'index',
      url: '/planning',
      templateUrl: 'app/planning/planning.html',
      resolve: {
        authentication: authProvider.requireAuthenticatedUser,
        authorization: authProvider.requireDirectDeliveryDashboardGisUser
      },
      data: {
        roles: [
          'direct_delivery_dashboard_gis'
        ]
      }
    })
  })
