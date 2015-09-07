/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsCtrl', function(assumptionList,  assumptionAddService){
    var vm = this;
    vm.assumptionList = assumptionList;
    vm.addAssumption = assumptionAddService.openForm
  });