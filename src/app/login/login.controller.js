'use strict';

angular.module('login')
  .controller('LoginCtrl', function($state, log, navbarService, ehaCouchDbAuthService) {
    this.login = function(username, password) {
      var params = {
        username: username,
        password: password
      };
      ehaCouchDbAuthService.signIn(params)
        .then(navbarService.updateItems.bind(null))
        .then(function() {
          log.success('authSuccess');
          $state.transitionTo('home');
        })
        .catch(function(err) {
          log.error(err);
        });
    };
  });
