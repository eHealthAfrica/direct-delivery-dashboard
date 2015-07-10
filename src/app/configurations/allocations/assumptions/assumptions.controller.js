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
    vm.suspendable = false;

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
    function toggleSuspensionState(doc){
      if(!doc.suspended){
        return vm.suspendable = true;
      }
      return vm.suspendable = false;
    }
    vm.addToOpenForEdit = function(doc){
      vm.openForEdit.push(doc);
      toggleSuspensionState(doc);
    };

    vm.suspendAllocation = function(){
      var msg = '';
      for(i in vm.openForEdit){
        vm.openForEdit[i].suspended = true;
      }
      if(vm.openForEdit.length > 1){
        msg = 'for '+ vm.openForEdit.length +' products'
      }else{
        msg = 'for '+ vm.openForEdit[0].product.code;
      }
      assumptionService.save(vm.openForEdit)
        .then(function(res){
          log.success('assumptionSuspension', res, msg)
        })
        .then(clearOpenForEdit)
    };
    vm.resumeAllocation = function(){
      var msg = '';
      // effect changes on only previuosly suspended docs
      var suspendedOnly = vm.openForEdit.filter(function(doc){
        var outcome = false;
        if(doc.suspended){
          doc.suspended = false;
          outcome = true;
        }
        return outcome;
      });
      if(suspendedOnly.length > 0){
        msg = 'for '+ suspendedOnly.length +' products'
      }else{
        msg = 'for '+ suspendedOnly[0].product.code;
      }
      assumptionService.save(suspendedOnly)
        .then(function(res){
          log.success('assumptionSuspension', res, msg)
        })
        .then(clearOpenForEdit)
    };

    function clearOpenForEdit(){
      vm.openForEdit = [];
    }
  });