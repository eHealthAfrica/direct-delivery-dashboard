'use strict';

angular.module('reports')
  .controller('ParkingReportCtrl', function ($window, config, log, parkingReportService) {
    var vm = this;//viewModel
    vm.administrativeLevels = ['zone', 'lga', 'ward'];

    vm.dateFormat = config.dateFormat;
    vm.stopOn = new Date();
    var ONE_MONTH = 2.62974e9;//milli secs
    var ONE_MONTH_BEFORE = vm.stopOn.getTime() - (ONE_MONTH * 3);
    vm.startFrom = new Date(ONE_MONTH_BEFORE);
    vm.currentRow = '';
    vm.previousRow = '';
    vm.rowList = {};

    function openDatePicker($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.opened = true;
    }

    vm.start = {
      opened: false,
      open: openDatePicker
    };

    vm.stop = {
      opened: false,
      open: openDatePicker
    };

    vm.getName = function (str, type, index) {
      str = str.split('#');
      var value;

      if (type === 'zone') {
        value = str[0];
        vm.currentRow = value;
        vm.rowList[index.toString()] = value;
        vm.previousRow = index === 0 ? '' : vm.rowList[(index - 1).toString()];
      }

      if (type === 'product') {
        value = str[2];
      }

      if (type === 'qty') {
        value = str[1];
      }

      return value;
    };

    vm.getName2 = function (str, type) {
      str = str.split('#');
      var value;

      if (type === 'zone') {
        value = str[0];
      }

      if (type === 'product') {
        value = str[1];
      }

      if (type === 'qty') {
        value = str[2];
      }

      return value;
    };

    vm.getTotal = function (location) {

    };



    vm.getReport = function () {
      parkingReportService.getParkingReport(vm.startFrom, vm.stopOn)
        .then(function (response) {
          vm.antigenReports = response.group;
          vm.report = response.report;
          vm.reportList = Object.keys(response.report || {});
          vm.selectedLevel = 'zone';
          vm.locationNames = Object.keys(vm.antigenReports[vm.selectedLevel] || {}).sort();
          vm.products = response.products.sort();
        });
    };

    vm.getReport();
	});
