/**
 * Created by ehealthafrica on 8/18/15.
 */

angular.module('allocations')
  .service('assumptionAddService', function($modal, log, assumptionService){

    this.openForm =  function(data){
      console.log(data);
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
          },
          states: function(locationService){
            return locationService.getLocationsByLevel('2')
              .catch(function(err){
                return [];
              });
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