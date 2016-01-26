'use strict'

angular.module('directDeliveryDashboard')
  .service('indexService', function (
    $log,
    $rootScope,
    $state,
    editableOptions,
    log,
    authService) {
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

    function stateChangeStart (event, next, current) {
      if (typeof (current) !== 'undefined') {
        window.nv.charts = {}
        window.nv.graphs = []
        window.nv.logs = {}
        // remove resize listeners
        window.onresize = null
      }
    }

    this.bootstrap = function () {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3'

      $rootScope.$on('$stateChangeStart', stateChangeStart)

      $rootScope.$on('$stateChangeError', stateChangeError)

      $rootScope.$on('unauthorized', onDBAuthError)
    }
  })
