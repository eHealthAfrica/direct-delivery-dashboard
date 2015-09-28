'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function($state, config, navbarService, ehaCouchDbAuthService) {
    this.name = config.name;
    this.items = navbarService.get();

    this.logout = function() {
      ehaCouchDbAuthService.signOut()
        .then(function() {
          $state.reload();
        });
    };
  });
