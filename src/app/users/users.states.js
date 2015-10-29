'use strict'

angular.module('users')
  .config(function ($stateProvider, authProvider) {
    $stateProvider.state('users', {
      abstract: true,
      parent: 'index',
      url: '/users',
      templateUrl: 'app/users/users.html',
      resolve: {
        authentication: authProvider.requireAuthenticatedUser,
        authorization: authProvider.requireAdminUser,
        users: function (usersService, log) {
          return usersService.all()
            .then(function (usersObj) {
              var users = []

              angular.forEach(usersObj, function (user) {
                users.push(user)
              })

              return users
            })
            .catch(function (reason) {
              log.error('userLoadErr')
              return []
            })
        }
      },
      data: {
        roles: [
          'direct_delivery_dashboard_super'
        ]
      }
    })
  })
