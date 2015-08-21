'use strict';

angular.module('reports')
  .service('deliveryReportService', function(reportsService) {

    function groupByDriver(driverObject, row) {
      if (!driverObject.hasOwnProperty(row.driverID)) {
        driverObject[row.driverID] = {};
      }

      var key = [row.facility.zone, row.status].join('-');
      if (!driverObject[row.driverID].hasOwnProperty(key)) {
        driverObject[row.driverID][key] = 0;
      }

      driverObject[row.driverID][key] ++;

      return driverObject;
    }

    function sortByZone(obj, row) {
      if (!obj.hasOwnProperty(row.facility.zone)) {
        obj[row.facility.zone] = [];
      }

      if (obj[row.facility.zone].indexOf(row.status) === -1) {
        obj[row.facility.zone].push(row.status);
      }

      return obj;
    }

    function setSubHeader(arr, row) {
      var key = [row.facility.zone, row.status].join('-');
      if (arr.indexOf(key) === -1) {
        arr.push(key);
      }
      return arr;
    }

    this.reportStatus = function () {
      return reportsService.getDailyDeliveries()
        .then(function (response) {
          var driverObject = {};
          var byZone = {};
          var subHeader = [];
          for (var i = 0; i < response.length; i++) {
            byZone = sortByZone(byZone, response[i]);
            driverObject = groupByDriver(driverObject, response[i]);
            subHeader = setSubHeader(subHeader, response[i]);
          }

          return {
            data: driverObject,
            header: byZone,
            subHeader: subHeader
          };
        });
    };

    this.getStatus = function (report, subHeader) {
      var values = [];
      for (var i = 0; i < subHeader.length; i++) {
        values.push(report[subHeader[i]] || 0);
      }
      return values;
    };

  });
