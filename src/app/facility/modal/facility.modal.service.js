'use strict';

angular.module('facility')
  .service('facilityModalService', function ($modal, log, facilityService) {
    this.getModal = function(locationData, facilityData){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/facility/modal/modal.html',
        controller: 'FacilityModalCtrl',
        controllerAs: 'facModalCtrl',
        resolve: {
          locationData: function () {
            return locationData;
          },
          facilityData: function () {
            return facilityData;
          }
        }
      });
      modalInstance.result
        .then(function (formData) {
          facilityService.save(formData)
            .then(function(data){
              //return log.success('', data);
            })
            .catch(function(err){
              //return log.error('assumptionSaveFailed', err)
            })
        })
        .catch(function (err) {
          //log.info('canceledAssumptionEdit', err);
        });
    }
  });