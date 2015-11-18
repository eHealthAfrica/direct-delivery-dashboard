'use strict'

angular.module('navbar')
  .controller('NavbarCtrl', function (
    config,
    navbarState,
    navbarService,
    authService,
    $rootScope,
    userStates, $scope
  ) {
    var vm = this
    $rootScope.selectedState = $rootScope.selectedState || userStates[0]
    $rootScope.userStates = userStates
    vm.states = userStates.map( function (item) {
      return item.name
    })
    vm.selectedState = 'Kano'
    $scope.selectState = function(state){
      console.log(state, 'selected')
      $rootScope.$broadcast('stateChanged', {
        state: state
      })
    }
    $rootScope.selectedState = vm.selectedState
    this.name = config.name
    this.navbarState = navbarState
    this.logout = authService.logout
    $scope.logout =this.logout
    this.toggleCollapse = navbarService.toggleCollapse
    vm.changeState = function (state) {
      state = angular.isString(state) ? JSON.parse(state) : state
      $rootScope.selectedState = state
      $rootScope.$broadcast('stateChanged', {
        state: state
      })
    }

    /*$rootScope.$watch('selectedState', function(newVal, oldVal){
      $rootScope.$broadcast('stateChanged', {
        state: newVal
      })
    })*/

  })
