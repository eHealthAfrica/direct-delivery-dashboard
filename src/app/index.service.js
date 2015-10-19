'use strict'

angular.module('directDeliveryDashboard')
  .service('indexService', function ($rootScope, $state, editableOptions, log) {
    function stateChangeError (event, toState, toParams, fromState, fromParams, err) {
      if (err === 'unauthenticated' || err === 'User not found') {
        return $state.go('login')
      }
      if (err === 'unauthorized') {
        return log.error('unauthorizedAccess', event)
      }
      log.error('stateChangeError', event)
    }

    this.bootstrap = function () {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3'

      $rootScope.$on('$stateChangeError', stateChangeError)
    }
  })
