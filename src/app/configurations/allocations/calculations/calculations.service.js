/**
 * Created by ehealthafrica on 7/11/15.
 */

angular.module('allocations')
  .service('calculationService', function(locationService, dbService, pouchUtil){

    var service = this;

    function setActiveTemplate (){

    }
    function getCustomTemplate (facilityID){

    }

    //TODO: change all static level reference to dynamic types
    service.getCurrentTemplate = function(){

    };
    service.getLocation = function(){
      return locationService.get
    };
    service.getfacility = function(){
      return locationService.getLocationByLevel("6");
    };
    service.saveCustomAllocation = function(){

    };

    /**
     * gets target population data for facilities
     * @param facilities. object or array of facility objects, preferably from location service
     * @return facilities.  match each facility entered with corresponding returned
     * data.
     */
    service.getTargetPop = function(facilities){
      var view = 'allocations/target-population',
        keys = [],
        options = {
        include_docs: true
      };

      if(angular.isArray(facilities)){
        for($i in facilities){
          keys.push(facilities[$i]._id);
        }
      }else{
       keys.push(facilities._id);
      }
      options.keys = keys;
      return dbService.getView(view, options)
        .then(pouchUtil.pluckDocs);
    };

    service.computeCoverage = function(facilities){

    };
    service.computeSchedule = function(facilities){

    };
    service.computeWastage = function(facilities){

    };
    service.computeBuffer = function(facilities){

    };
});