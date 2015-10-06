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
      var response = {};
      for(var i in vm.csv.result){
        vm.csv.result[i].facility = {};
        vm.csv.result[i].facility['_id'] = vm.csv.result[i].facility_id;
        vm.csv.result[i].facility['name'] = vm.csv.result[i].facility_name;

        delete vm.csv.result[i].facility_id;
        delete vm.csv.result[i].facility_name;

        vm.csv.result[i].doc_type = 'target-pop';
        response[vm.csv.result[i]._id] = vm.csv.result[i];
      }
      $modalInstance.close(response);
    };
    vm.cancel = function(){
      $modalInstance.dismiss();
    }
  });