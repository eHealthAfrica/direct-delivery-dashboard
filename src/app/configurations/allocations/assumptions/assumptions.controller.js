/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsController', function(assumptionList){
    var vm = this;
    vm.assumptionList = assumptionList;
  });