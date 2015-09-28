'use strict';

angular.module('directDeliveryDashboard')
  .service('indexService', function($rootScope, $state, editableOptions, log) {
    /*eslint-disable no-unused-vars */
    function stateChangeError(event, toState, toParams, fromState, fromParams, authErr) {
    /*eslint-enable no-unused-vars */
      if (authErr === 'unauthenticated') {
        return $state.go('login');
      }
      log.error('stateChangeError', event);
    }

    this.bootstrap = function() {
      // set xeditable bootstrap theme
      editableOptions.theme = 'bs3';

      $rootScope.$on('$stateChangeError', stateChangeError);
    };
  });
