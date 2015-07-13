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
    vm.lgas = [];
    vm.wards = [];

    vm.findLga = function(state){
      locationService.getByIds([state])
        .then(function(response){
          vm.lgas = response;
        })
        .catch(function(err){
          log.error('', err, 'could not fetch lga list, please try again. contact admin if this persists.');
        });
    };
    vm.findWard = function(lga){

    };
    vm.filterLocation = function(level, id){

    };
    function  switchRenderedPartial (partial){
      return vm.renderedPartial = partial;
    }
    function switchRenderedData (view){
      return vm.renderedData;
    }

    vm.filterLocation = function(location){

    };
    vm.changeDataView = function(partial, viewLabel){
      vm.renderedViewLabel = viewLabel;
      switchRenderedPartial(partial);
      switchRenderedData(viewLabel.replace(' ', ''));
    };

  });