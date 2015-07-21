/**
 * Created by ehealthafrica on 7/9/15.
 */

angular.module('allocations')
  .controller('AssumptionsEditController', function($scope, $modalInstance, data){
    var vm = this;
    vm.data = data;

    vm.submit = function(){
      $modalInstance.close(vm.data);
    };
    vm.cancel = function(){
      $modalInstance.dismiss('cancelled');
    };

  });