'use strict';

angular.module('reports')
  .controller('DeliveryReportCtrl', function (deliveryStatusReport, deliveryReportService) {
    var vm = this;
    vm.reportStatus = deliveryStatusReport.data;
    vm.header = deliveryStatusReport.header;
    vm.subHeader = deliveryStatusReport.subHeader;
    vm.getSubHeader = function (header) {
      return header.split('-')[1];
    };
    vm.getStatus = function (report) {
      return deliveryReportService.getStatus(report, vm.subHeader);
    };
  });
