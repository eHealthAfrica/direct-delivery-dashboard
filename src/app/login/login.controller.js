'use strict';

angular.module('login')
  .controller('LoginCtrl', function(authService) {
    this.login = authService.login;
  });
