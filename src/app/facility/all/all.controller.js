'use strict';

angular.module('facility')
  .controller('FacilityAllCtrl', function(facilityService, log) {
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
        })
        .catch(function (reason) {
          console.log(reason);
        });
    };

    facilityService.getStateLocations()
      .then(function (response) {
        vm.facilities = response.facilities;
        vm.locations = response.locations;
        setStatus(response.facilities);
      })
      .catch(function (reason) {
        log('unknownError', reason)
      });

    function setStatus(facilities) {
      var i = facilities.length;
      while (i--) {
        vm.facilityStatus[facilities[i]._id] = facilities[i].status;
      }
    }
  });
