'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function(
    config,
    navbarState,
    navbarService,
    authService
  ) {
    this.name = config.name;
    this.navbarState = navbarState;
    this.logout = authService.logout;
    this.toggleCollapse = navbarService.toggleCollapse;
  });
