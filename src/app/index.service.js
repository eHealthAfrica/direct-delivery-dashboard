'use strict'

angular.module('directDeliveryDashboard')
  .service('indexService', function (
    $log,
    $rootScope,
    $state,
    editableOptions,
    log,
    authService,
    locationService
  ) {
    var _this = this

    function stateChangeError (event, toState, toParams, fromState, fromParams, err) {
      if (err === 'unauthenticated' || err === 'User not found') {
        return $state.go('login')
      }
      if (err === 'unauthorized') {
        return log.error('unauthorizedAccess', event)
      }
      log.error('stateChangeError', event)
      $log.error(err)
    }

    function onDBAuthError () {
      log.warning('accessDeniedOrExpired')
      return authService.logout()
        .then($state.go.bind($state, 'login'))
    }

    function updateNavbarStates (event, toState, toParams, fromState) {
      if (fromState.name === 'login') {
        _this.getUserStates()
          .then(function (states) {
            $rootScope.userStates = states
            $rootScope.selectedState = states[0] || {}
          })
          .catch(function (reason) {
            $rootScope.userStates = []
            $rootScope.selectedState = {}
            if (parseInt(reason.code, 10) === 404) {
              log.error('userHasNoState')
            } else {
              log.error('userStatesErr', reason)
            }
          })
      }
    }

    _this.getUserStates = function () {
      function getStatesByUser (user) {
        var LEVEL = '2'
        if (user.isAdmin()) {
          return locationService.getLocationsByLevel(LEVEL)
        }
        var stateIds = authService.authorisedStates(user)
        return locationService.getLocationsByLevelAndId(LEVEL, stateIds)
      }

      return authService.getCurrentUser()
        .then(getStatesByUser)
    }

    this.bootstrap = function () {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3'

      $rootScope.$on('$stateChangeError', stateChangeError)

      $rootScope.$on('$stateChangeSuccess', updateNavbarStates)

      $rootScope.$on('unauthorized', onDBAuthError)
    }
  })
