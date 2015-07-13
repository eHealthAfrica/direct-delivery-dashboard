/**
 * Created by ehealthafrica on 7/10/15.
 */

angular.module('allocations')
  .controller('CalculationsController', function(products, locations, locationService, calculationService, pouchUtil, log){
    var vm = this;

    vm.productList = products || [];
    vm.renderedPartial = 'tp';
    vm.renderedViewLabel = 'target populations';
    vm.renderedData = [];
    vm.locationStates = ['KN', 'BA'];
    vm.selectedState = 'KN';
    vm.selectedLga = '';
    vm.lgas = [];
    vm.wards = [];

    vm.findLga = function(state){
      var keys = [];
      keys.push(["4", state]);
      return locationService.getByLevelAndAncestor(keys)
        .then(function(response){
          vm.lgas = response;
          return vm.lgas;
        })
        .catch(function(err){
          log.error('', err, 'could not fetch lga list, please try again. contact admin if this persists.');
        });
    };

    vm.filterByLocation = function(locationid){
      var level = "6";
      var keys = [];

      if(angular.isArray(locationid)){
       for(i in locationid){
         keys.push([level, locationid[i]._id]);
       }
      }else{
        keys.push([level, locationid._id]);
      }
      return locationService.getByLevelAndAncestor(keys)
        .then(function(response){
          return response;
        })
    };
    vm.findLga(vm.selectedState)
      .then(function(lgas){
        vm.selectedLga = lgas[0];
        return vm.selectedLga;
      })
      .then(vm.filterByLocation)
      .then(calculationService.getTargetPop);

    function  switchRenderedPartial (partial){
      return vm.renderedPartial = partial;
    }
    function switchRenderedData (view){
      return vm.renderedData;
    }

    vm.changeDataView = function(partial, viewLabel){
      vm.renderedViewLabel = viewLabel;
      switchRenderedPartial(partial);
      switchRenderedData(viewLabel.replace(' ', ''));
    };

  });