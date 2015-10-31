'use strict'

angular.module('navbar')
  .controller('NavbarCtrl', function (
    config,
    navbarState,
    navbarService,
    authService,
    $rootScope,
    userStates
  ) {
    var vm = this
    $rootScope.selectedState = $rootScope.selectedState || userStates[0]
    vm.userStates = userStates
    this.name = config.name
    this.navbarState = navbarState
    this.logout = authService.logout
    this.toggleCollapse = navbarService.toggleCollapse
    vm.changeState = function (state) {
      state = angular.isString(state) ? JSON.parse(state) : state
      $rootScope.selectedState = state
      $rootScope.$broadcast('stateChanged', {
        state: state
      })
    }
  })
