'use strict'

angular.module('navbar')
  .controller('NavbarCtrl', function (
    config,
    navbarState,
    navbarService,
    authService,
    $scope,
    $rootScope,
    log
  ) {
    // run to initialize stateMap at point of creation of this controller, on reload
    function initializeStateMap () {
      authService.loadStatesForCurrentUser()
    }

    initializeStateMap()

    $scope.stateMap = authService.stateMap

    $scope.selectState = function (state) {
      authService.setUserSelectedState(state)
        .then(authService.getUserSelectedState.bind(null, true))
        .then(function (id) {
          $rootScope.$broadcast('stateChanged', { state: {
            name: state,
            _id: id
          } })
        })
        .catch(function (error) {
          log.error('stateSelectionErr', error)
        })
    }

    $scope.name = config.name
    this.name = config.name

    $scope.navbarState = navbarState

    $scope.logout = authService.logout

    $scope.toggleCollapse = navbarService.toggleCollapse
  })
