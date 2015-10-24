'use strict'

angular.module('directDeliveryDashboard')
  .service('indexService', function ($rootScope, $state, editableOptions, log, authService) {

    function stateChangeError (event, toState, toParams, fromState, fromParams, err) {
      if (err === 'unauthenticated' || err === 'User not found') {
        return $state.go('login')
      }
      if (err === 'unauthorized') {
        return log.error('unauthorizedAccess', event)
      }
      log.error('stateChangeError', event)
    }

    function onDBAuthError () {
      log.warning('accessDeniedOrExpired')
      return authService.logout()
        .then($state.go.bind($state, 'login'))
    }

    this.bootstrap = function () {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3'

      $rootScope.$on('$stateChangeError', stateChangeError)

      $rootScope.$on('unauthorized', onDBAuthError)
    }
  })

