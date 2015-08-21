/**
 * Created by ehealthafrica on 8/13/15.
 */

angular.module('allocations')
  .controller('AllocationValuesController', function(data, assumptionService, log){
    var vm = this;

    vm.allocationTemp = data;
    vm.update= function(){
       assumptionService.save(data)
        .then(function(data){
          return log.success('assumptionEdited', data);
        })
    }
  });