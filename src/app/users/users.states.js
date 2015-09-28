'use strict';

angular.module('users')
  .config(function($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('users', {
      abstract: true,
      parent: 'index',
      url: '/users',
      templateUrl: 'app/users/users.html',
      controller: 'UsersCtrl',
      controllerAs: 'usersCtrl',
      resolve: {
        users: function(usersService) {
          return usersService.all()
            .then(function(usersObj) {
              var users = [];

              angular.forEach(usersObj, function(user) {
                users.push(user);
              });

              return users;
            });
        },
        authentication: ehaCouchDbAuthServiceProvider.requireAuthenticatedUser
      }
    });
  });
