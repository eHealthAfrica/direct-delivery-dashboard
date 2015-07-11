/**
 * Created by ehealthafrica on 7/10/15.
 */

angular.module('allocations')
  .controller('CalculationsController', function(products, locations){
    var vm = this;

    vm.productList = products || [];
    vm.renderedPartial = 'tp';
    vm.renderedViewLabel = 'change data view';
    vm.renderedData = [];

    vm.switchRenderedPartial = function(){
      if(vm.renderedView === 'tp'){
        return vm.renderedView === 'pv';
      }
      return vm.renderedView ==='tp';
    };

    vm.filterLocation = function(location){

    };
    vm.changeDataView = function(partial, viewLabel){
      vm.renderedViewLabel = viewLabel;
    };

  });