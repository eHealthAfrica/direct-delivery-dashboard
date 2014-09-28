'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($log, facilityReports, facilityCSV, facilityChart, FACILITY_FILTERS) {
    var vm = this;
    vm.loading = true;
    vm.error = false;
    vm.reportingFilters = FACILITY_FILTERS;

    function bindSummaries(summaries) {
      vm.loading = false;
      vm.summaries = summaries;
      return angular.copy(summaries);
    }

    function bindFacilityChart(summaries) {
      var _summaries = angular.copy(summaries);
      vm.chart = facilityChart(summaries);
      return _summaries;
    }

    function bindCSVData(summaries) {
      vm.csvData = facilityCSV(summaries);
    }

    function handleError(reason) {
      vm.loading = false;
      vm.error = true;
      $log.error('Error loading facilities', reason);
    }

    facilityReports.load()
      .then(bindSummaries)
      .then(bindFacilityChart)
      .then(bindCSVData)
      .catch(handleError);
  });
