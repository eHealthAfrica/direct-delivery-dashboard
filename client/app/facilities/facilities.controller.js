'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($q, Auth, facilityCSV, facilityChart, FACILITY_FILTERS, summaries) {
    var vm = this;
    vm.currentUser = Auth.getCurrentUser();
    vm.reportingFilters = FACILITY_FILTERS;
    vm.hideChart = false;
    vm.tableColumns = 6;

    vm.toggleChart = function() {
      vm.hideChart = !vm.hideChart;
      vm.tableColumns = vm.hideChart ? 9 : 6;
    };

    vm.toggleRow = function(facilityID) {

      if (vm.stockCountRowCollapse.hasOwnProperty(facilityID)) {
        var currentState = vm.stockCountRowCollapse[facilityID];
        setStockCountRowCollapse();
        vm.stockCountRowCollapse[facilityID] = !currentState;
      }
      else {
        setStockCountRowCollapse();
        vm.stockCountRowCollapse[facilityID] = true;
      }
    };

    function bindSummaries(summaries) {
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

    function setStockCountRowCollapse() {
      vm.stockCountRowCollapse = {};
    }

    setStockCountRowCollapse();


    var d = $q.defer();
    d.promise
      .then(bindSummaries)
      .then(bindFacilityChart)
      .then(bindCSVData);

    d.resolve(summaries);
  });
