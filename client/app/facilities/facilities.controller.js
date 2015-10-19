'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($q, Auth, facilityCSV, facilityChart, FACILITY_FILTERS, summaries, AppConfig, facilityReports) {
    console.log(summaries);
    var vm = this;
    vm.currentUser = Auth.getCurrentUser();
    vm.reportingFilters = FACILITY_FILTERS;
    vm.reporting = facilityReports.reportingConstants;
    vm.hideChart = false;
    vm.tableColumns = 8;
    vm.isSaving = {};
    vm.currentStatus = {};

    vm.showToggleButton = function() {
      return vm.currentUser.showStates && vm.currentUser.showZones && vm.currentUser.showLgas;
    };

    function updateStatus(appConfig) {
      var phoneObject = facilityReports.getPhoneStatus(appConfig.workingPhone);
      var facilityID = appConfig.facility._id;
      var phoneStatus = {
        modifiedBy: vm.currentUser._id,
        modified: new Date().getTime(),
        status: !vm.currentStatus[facilityID]
      };
      phoneObject.fullList.push(phoneStatus);
      AppConfig.put(appConfig._id, {workingPhone: phoneObject.fullList})
        .then(function () {
          updateUI(facilityID, !vm.currentStatus[facilityID]);
          var _summaries = summaries.summaries;
          for (var i = 0; i < _summaries.length; i++) {
            if (facilityID === _summaries[i].id) {
              _summaries[i].reportingStatus = facilityReports.getReportingStatus( _summaries[i].daysFromLastCountDate, phoneStatus.status);
              break;
            }
          }
          bindFacilityChart(_summaries);
        })
        .catch(function (reason) {
          vm.isSaving[facilityID] = false;
          console.log(reason);
        });
    }

    function updateUI(id, status) {
      vm.currentStatus[id] = status;
      vm.isSaving[id] = false;
    }

    vm.updateStatus = function(id) {
      var appConfig = summaries.appConfig[id];
      vm.isSaving[id] = true;
      AppConfig.get(appConfig.facility.email)
        .then(updateStatus)
        .catch(function (reason) {
          vm.isSaving[id] = false;
          console.log(reason);
        });
    };

    vm.toggleChart = function() {
      vm.hideChart = !vm.hideChart;
      vm.tableColumns = vm.hideChart ? 11 : vm.tableColumns;
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
      var _summaries = angular.copy(summaries);
      vm.csvData = facilityCSV(summaries);
      return summaries;
    }

    function bindPhoneStatus(summaries) {
      var rows = summaries;
      for (var i = 0; i < rows.length; i++) {
        var status = facilityReports.getPhoneStatus(rows[i].workingPhone).currentStatus;
        updateUI(rows[i].id, status);
      }
    }

    function setStockCountRowCollapse() {
      vm.stockCountRowCollapse = {};
    }

    setStockCountRowCollapse();


    var d = $q.defer();
    d.promise
      .then(bindSummaries)
      .then(bindFacilityChart)
      .then(bindCSVData)
      .then(bindPhoneStatus);

    d.resolve(summaries.summaries);
  });
