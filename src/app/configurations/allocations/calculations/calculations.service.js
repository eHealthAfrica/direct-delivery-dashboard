/**
 * Created by ehealthafrica on 7/11/15.
 */

angular.module('allocations')
  .service('calculationService', function(locationService){

    var service = this;

    service.getCurrentTemplate = function(){

    };
    service.getLocation = function(){
      return locationService.get
    };
    service.getfacility = function(){
      return locationService.getLocationByLevel(6);
    };
    service.saveCustomAllocation = function(){

    }
});