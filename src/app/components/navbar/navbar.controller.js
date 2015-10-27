'use strict'

angular.module('navbar')
  .controller('NavbarCtrl', function (
    config,
    navbarState,
    navbarService,
    authService
  ) {
    var vm = this
    vm.name = config.name
    vm.username = ''
    vm.navbarState = navbarState
    vm.logout = authService.logout
    vm.toggleCollapse = navbarService.toggleCollapse

    authService.getCurrentUser()
      .then(function (user) {
        vm.username = user.name
      })
  })
