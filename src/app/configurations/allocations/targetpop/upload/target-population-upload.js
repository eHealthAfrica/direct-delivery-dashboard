/**
 * Created by ehealthafrica on 8/31/15.
 */

angular.module('allocations')
  .controller('TargetPopCSVUploadCtrl', function($modalInstance){
    var vm = this;

    vm.csv = {
      header: true,
      separator: ','
    };

    vm.close = function(){
      for(var i in vm.csv.result){
        vm.csv.result[i]._id = vm.csv.result[i].state +'-'+vm.csv.result[i].facility+'-'+vm.csv.result[i].year;
        vm.csv.result[i].doc_type = 'target-pop';
      }
      $modalInstance.close(vm.csv.result);
    };
    vm.cancel = function(){
      $modalInstance.dismiss();
    }
  });