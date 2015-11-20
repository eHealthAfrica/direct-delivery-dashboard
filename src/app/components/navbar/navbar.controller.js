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
    function initializeStateMap() {
      authService.getCurrentUser()
        .then(function(user){
        userStateService.loadStatesForCurrentUser(user)
      })
        .catch(function(){
          userStateService.clearStatesForUser()
        })
    }

    initializeStateMap()

    $scope.stateMap = userStateService.stateMap


    $scope.$watch(function(){
      //console.log('digest loop', userStateService.stateMap )
    })



    $scope.selectState = function (state) {
      console.log(state, 'selected')
      authService.getCurrentUser()
        .then(function(user){
          if(userStateService.setUserSelectedState(user.userCtx.name, state)){
            console.log(state, 'User states election changed')
            $rootScope.$broadcast('stateChanged', {state: {name: state }})
          }

        })
    }

    $scope.name = config.name

    $scope.navbarState = navbarState

    $scope.logout =authService.logout

    $scope.toggleCollapse = navbarService.toggleCollapse


  })
