'use strict'

angular.module('navbar')
  .controller('NavbarCtrl', function (
    config,
    navbarState,
    navbarService,
    authService,
    $scope,
    $rootScope,
    userStateService
  ) {
    // run to initialize stateMap at point of creation of this controller, on reload
    function initializeStateMap () {
      userStateService.loadStatesForCurrentUser()
    }

    initializeStateMap()

    $scope.stateMap = userStateService.stateMap

    $scope.selectState = function (state) {
      console.log(state, 'selected')
      userStateService.setUserSelectedState(state)
        .then(function (status) {
          if (status) {
            $rootScope.$broadcast('stateChanged', { state: { name: state } })
          }
        })
    }

    $scope.name = config.name
    this.name = config.name

    $scope.navbarState = navbarState

    $scope.logout = authService.logout

    $scope.toggleCollapse = navbarService.toggleCollapse
  })
