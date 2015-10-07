'use strict';

angular.module('navbar')
  .controller('NavbarCtrl', function(
    config,
    navbarItems,
    authService
  ) {
    this.name = config.name;
    this.collapsed = true;
    this.navbarItems = navbarItems;
    this.logout = authService.logout;
  });
