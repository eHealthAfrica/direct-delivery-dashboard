'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($log, facilityReports, facilityCSV) {
    var vm = this;
    vm.loading = true;
    vm.error = false;

    function bindSummaries(summaries) {
      vm.loading = false;
      vm.summaries = summaries;
      return angular.copy(summaries);
    }

    function bindCSVData(summaries) {
      vm.csvData = facilityCSV(summaries);
    }

    function handleError(reason) {
      vm.loading = false;
      vm.error = true;
      $log.error('Error loading facilities', reason);
    }

    facilityReports
      .then(bindSummaries)
      .then(bindCSVData)
      .catch(handleError);
  });
