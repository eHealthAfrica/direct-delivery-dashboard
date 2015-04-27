'use strict';

angular.module('users')
  .config(function($stateProvider) {
    $stateProvider.state('users.create', {
      url: '/create',
      templateUrl: 'app/users/form/form.html',
      controller: 'UsersFormCtrl',
      controllerAs: 'usersFormCtrl',
      resolve: {
        type: function() {
          return 'create';
        },
        model: function() {
          return {}
        }
      }
    });
  });
