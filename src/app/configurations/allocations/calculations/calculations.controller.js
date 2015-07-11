/**
 * Created by ehealthafrica on 7/10/15.
 */

angular.module('allocations')
  .controller('CalculationsController', function(products, locations){
    var vm = this;

    vm.productList = products || [];
    vm.renderedPartial = 'tp';
    vm.renderedViewLabel = 'target populations';
    vm.renderedData = [];
    vm.locationStatesOfInterest = ['KN'];


    vm.locationStates = locations.filter(function(location){
      var i = vm.locationStatesOfInterest.indexOf(location._id);
      return (i != -1);
    });

    switchRenderedPartial = function(partial){
      return vm.renderedPartial = partial;
    };
    switchRenderedData = function(view){
      return vm.renderedData;
    };

    vm.filterLocation = function(location){

    };
    vm.changeDataView = function(partial, viewLabel){
      vm.renderedViewLabel = viewLabel;
      switchRenderedPartial(partial);
      switchRenderedData(viewLabel.replace(' ', ''));
    };

  });