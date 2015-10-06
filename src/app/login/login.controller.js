'use strict';

angular.module('login')
  .controller('LoginCtrl', function($state, log, ehaCouchDbAuthService) {
    this.login = function(username, password) {
      var params = {
        username: username,
        password: password
      };
      ehaCouchDbAuthService.signIn(params)
        .then(function() {
          log.success('authSuccess');
          $state.transitionTo('home');
        })
        .catch(function(err) {
          log.error(err);
        });
    };
  });
