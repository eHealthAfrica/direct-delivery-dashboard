'use strict';

angular.module('users')
  .config(function($stateProvider) {
    $stateProvider.state('users', {
      abstract: true,
      parent: 'index',
      url: '/users',
      templateUrl: 'app/users/users.html',
      controller: 'UsersCtrl',
      controllerAs: 'usersCtrl',
      resolve: {
        users: function(usersService) {
          return usersService.all();
        }
      }
    });
  });
