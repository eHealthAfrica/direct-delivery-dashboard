'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($log, facilityReports) {
    var vm = this;
    vm.loading = true;
    vm.error = false;

    function bindSummaries(summaries) {
      vm.loading = false;
      vm.summaries = summaries;
    }

    function handleError(reason) {
      vm.loading = false;
      vm.error = true;
      $log.error('Error loading facilities', reason);
    }

    facilityReports
      .then(bindSummaries)
      .catch(handleError);
  });
