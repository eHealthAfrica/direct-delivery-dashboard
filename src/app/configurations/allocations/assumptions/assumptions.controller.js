/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsController', function(products){
    var vm = this;
    vm.products = products;
  });