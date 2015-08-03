'use strict';

angular.module('lmisApp')
  .controller('FacilitiesCtrl', function($q, Auth, facilityCSV, facilityChart, FACILITY_FILTERS, summaries, $scope, AppConfig) {
    var vm = this;
    vm.currentUser = Auth.getCurrentUser();
    vm.reportingFilters = FACILITY_FILTERS;
    $scope.isSaving = {};
    $scope.currentStatus = {};

    vm.showToggleButton = function() {
      return vm.currentUser.showStates && vm.currentUser.showZones && vm.currentUser.showLgas;
    };

    $scope.updateStatus = function(id) {
      var appConfig = summaries.appConfig[id];
      $scope.isSaving[id] = true;
      AppConfig.put(appConfig.facility.email, {workingPhone: !$scope.currentStatus[id]})
        .then(function () {
          $scope.currentStatus[id] = !$scope.currentStatus[id];
          $scope.isSaving[id] = false;
        })
        .catch(function (reason) {
          $scope.isSaving[id] = false;
          console.log(reason);
        });
    };

    (function bindPhoneStatus() {
      var rows = summaries.summaries;
      for (var i = 0; i < rows.length; i++) {
        $scope.currentStatus[rows[i].id] = angular.isUndefined(rows[i].workingPhone) ? true : rows[i].workingPhone;
        $scope.isSaving[rows[i].id] = false;
      }
    })();

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

    var d = $q.defer();
    d.promise
      .then(bindSummaries)
      .then(bindFacilityChart)
      .then(bindCSVData);

    d.resolve(summaries.summaries);
  });
