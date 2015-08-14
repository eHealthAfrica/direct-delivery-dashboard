/**
 * Created by ehealthafrica on 7/7/15.
 */
angular.module('allocations')
  .controller('AssumptionsCtrl', function(assumptionList, $modal, log, assumptionService){
    var vm = this;
    vm.assumptionList = assumptionList;
    vm.addAssumption = function(data){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/configurations/allocations/assumptions/assumption.template/newtemplate.html',
        controller: 'AssumptionsTemplateAddCtrl',
        controllerAs: 'tempAddCtrl',
        resolve: {
          data: function(){
            return data;
          },
          products : function(productService){
            return productService.getAll();
          }
        }
      });
      modalInstance.result.then(function (formData) {

        assumptionService.save(formData)
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