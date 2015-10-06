'use strict';

angular.module('directDeliveryDashboard')
  .service('indexService', function($rootScope, $state, editableOptions, log) {
    /*eslint-disable no-unused-vars */
    function stateChangeError(event, toState, toParams, fromState, fromParams, err) {
    /*eslint-enable no-unused-vars */
      if (err === 'unauthenticated') {
        return $state.go('login');
      }
      if (err === 'unauthorized') {
        return log.error('unauthorizedAccess', event);
      }
      log.error('stateChangeError', event);
    }

    this.bootstrap = function() {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3';

      $rootScope.$on('$stateChangeError', stateChangeError);
    };
  });
