'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function($state, log, config, navbarService, ehaCouchDbAuthService) {
    this.name = config.name;
    this.items = navbarService.get();

    this.logout = function() {
      ehaCouchDbAuthService.signOut()
        .then($state.go.bind($state, 'login'))
        .catch(log.error.bind(log, 'logoutFailed'));
    };
  });
