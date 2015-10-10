'use strict';

angular.module('facility')
  .controller('FacilityReportsCtrl', function(facilityService, log) {
    var vm = this;

    vm.facilityStatus = {};
    vm.updateStatus = function (report) {
      var facility = vm.locations.facility[report._id];
      facility.cceStatus = facility.cceStatus || [];
      var status = {
        status: !vm.facilityStatus[report._id].status,
        date: new Date().toJSON()
      };

      facility.cceStatus.push(status);
      facilityService.save(facility)
        .then(function () {
          vm.facilityStatus[report._id].status = status.status;
          vm.facilityStatus[report._id].date = status.date;
          updateView();
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };

    function updateView () {
      facilityService.getStateLocations()
        .then(function (response) {
          vm.facilities = response.facilities.filter(function (row) {
            return !row.status.status;
          });
          vm.locations = response.locations;
          setStatus(response.facilities);
        })
        .catch(function (reason) {
          log('unknownError', reason)
        });
    }

    function setStatus(facilities) {
      var i = facilities.length;
      while (i--) {
        vm.facilityStatus[facilities[i]._id] = facilities[i].status;
      }
    }
    updateView();
  });
