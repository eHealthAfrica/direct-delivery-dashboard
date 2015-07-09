/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsController', function(assumptionList, $modal, log, assumptionService){
    var vm = this;
    vm.assumptionList = assumptionList;
    console.log(assumptionList);

    vm.hoverRows = false;
    vm.openForEdit = [];

    vm.editAssumption = function(data){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/configurations/allocations/assumptions/assumptions-edit/edit.html',
        controller: 'AssumptionsEditController',
        controllerAs: 'assumptionsEditController',
        resolve: {
          data: function(){
            return data;
          }
        }
      });
      modalInstance.result.then(function (data) {

        assumptionService.save(data)
          .then(function(data){
            return log.success('assumptionEdited', data);
          })
          .catch(function(err){
            return log.error('assumptionSaveFailed', err)
          })
      })
      .catch(function (err) {
        log.info('canceledAssumptionEdit', err);
      });
    };

    vm.addToOpenForEdit = function(doc){
      vm.openForEdit.push(doc);
    }

    vm.suspendAllocation = function(){
      for(i in vm.openForEdit){
        vm.openForEdit[i].suspended = true;
      }
      assumptionService.save(vm.openForEdit)
        .then(clearOpenForEdit)
    };

    function clearOpenForEdit(){
      vm.openForEdit = [];
    }
  });