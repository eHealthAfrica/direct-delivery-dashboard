'use strict'

angular.module('users')
  .config(function ($stateProvider) {
    $stateProvider.state('users.all', {
      url: '',
      templateUrl: 'app/users/all/all.html',
      controller: 'UsersAllCtrl',
      controllerAs: 'usersAllCtrl',
      data: {
        label: 'Users'
      }
    })
  })
