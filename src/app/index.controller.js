'use strict';

angular.module('directDeliveryDashboard')
  .controller('IndexCtrl', function($rootScope, log) {
    function stateChangeError(event) {
      log.error('stateChangeError', event);
    }

    $rootScope.$on('$stateChangeError', stateChangeError);
  });
