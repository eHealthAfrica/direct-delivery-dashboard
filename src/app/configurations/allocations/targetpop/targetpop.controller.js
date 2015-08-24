/**
 * Created by ehealthafrica on 8/22/15.
 */

angular.module('allocations')
  .controller('TargetPopulationsController', function(locations, locationService, calculationService){
    var vm = this;

    vm.locationStates = ['KN', 'BA'];
    vm.selectedState = 'KN';
    vm.selectedLga = '';
    vm.lgas = [];
    vm.wards = [];

    findLga = function (state) {
      var keys = [];
      keys.push(["4", state]);
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.lgas = response;
          vm.selectedLga = response[0];
          return vm.selectedLga;
        })
        .catch(function (err) {
          log.error('', err, 'could not fetch lga list, please try again. contact admin if this persists.');
        });
    };
     function getFacilities(lgs) {
      var level = "6";
      var keys = [];
      var lgas = vm.selectedLga;
      if(!lgas){
        vm.rederedData = [];
        return;
      }
      if (angular.isArray(lgas)) {
        for (i in locationid) {
          keys.push([level, lgas[i]._id]);
        }
      } else {
        keys.push([level, lgas._id]);
      }
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          return response;
        })
        .catch(function(err){
          log.error('','', 'could not retrieve facilities, please reload and try again')
        })
    }
    vm.switchLocationState = function (stateID) {
      var state = stateID || vm.selectedState;
      return findLga(state)
        .then(getFacilities)
        .catch(function(err){
          log.error('',err, 'switching LGA failed');
          return [];
        })
    };

    vm.stateList = locations.filter(function(location){
      return location.level == '2';
    });

    findLga(vm.selectedState)
      .then(getFacilities)
      .then(calculationService.getTargetPop)
      .then(function (response) {
        console.log(response);
        vm.renderedData = response;
        return response;
      });
  });