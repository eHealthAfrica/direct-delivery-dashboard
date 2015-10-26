'use strict'

angular.module('users')
  .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('users', {
      abstract: true,
      parent: 'index',
      url: '/users',
      templateUrl: 'app/users/users.html',
      controller: function ($state) {
        if ($state.current.name === 'users') {
          $state.go('users.all')
        }
      },
      resolve: {
        authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser,
        authorization: ehaCouchDbAuthServiceProvider.requireAdminUser,
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
