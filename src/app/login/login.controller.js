'use strict';

angular.module('login')
  .controller('LoginCtrl', function($state, log, AuthService) {
    this.login = function(username, password) {
      AuthService.login(username, password)
        .then(function() {
          log.success('authSuccess');
          $state.transitionTo('home');
        })
        .catch(function(err) {
          log.error(err);
        });
    };
  });
