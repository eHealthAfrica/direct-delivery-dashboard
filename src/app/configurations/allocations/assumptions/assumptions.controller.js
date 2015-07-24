/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsController', function(assumptionList, $modal, log, assumptionService){
    var vm = this;
    vm.assumptionList = assumptionList[0];

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
    }
  });