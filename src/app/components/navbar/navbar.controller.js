'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function($state, log, config, navbarService, navbarItems, ehaCouchDbAuthService) {
    this.name = config.name;
    this.collapsed = true;
    this.navbarItems = navbarItems;
    this.logout = function() {
      ehaCouchDbAuthService.signOut()
        .then(navbarService.updateItems.bind())
        .then($state.go.bind($state, 'login'))
        .catch(log.error.bind(log, 'logoutFailed'));
    };
  });
