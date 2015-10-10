'use strict'

angular.module('planning')
  .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('planning', {
      abstract: true,
      parent: 'index',
      url: '/planning',
      templateUrl: 'app/planning/planning.html',
      resolve: {
        authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser,
        authorization: function (authService) {
          // XXX: we'd prefer to use ehaCouchDbAuthServiceProvider's
          //      require<Role>User convenience method here, but that doesn't
          //      auto-authorise admins. See:
          //      https://github.com/eHealthAfrica/angular-eha.couchdb-auth/issues/28
          return authService.requireRoles([
            'direct_delivery_dashboard_gis'
          ])
        }
      },
      data: {
        roles: [
          'direct_delivery_dashboard_gis'
        ]
      }
    })
  })
