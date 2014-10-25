'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($q, Auth, facilityCSV, facilityChart, FACILITY_FILTERS, summaries) {
    var vm = this;
    vm.currentUser = Auth.getCurrentUser();
    vm.reportingFilters = FACILITY_FILTERS;

    function bindSummaries(summaries) {
      console.log(summaries);
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

    var d = $q.defer();
    d.promise
      .then(bindSummaries)
      .then(bindFacilityChart)
      .then(bindCSVData);

    d.resolve(summaries);
  });
