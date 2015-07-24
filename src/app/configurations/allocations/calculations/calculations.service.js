/**
 * Created by ehealthafrica on 7/11/15.
 */

angular.module('allocations')
  .service('calculationService', function(locationService, dbService, pouchUtil, assumptionService){

    var service = this;

    function prepareTemplate (){
      var temp = {
        coverage : {}
      };
      return assumptionService.getAll()
        .then(function(response){
          for(var i in response){
            temp.coverage[response[i].product.code] = response[i].coverage;
          }
          return temp;
        });
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
      var hay = {};
      var res = [];
      return prepareTemplate()
        .then(function(response){
          for(var i in facilities){
            hay.facility = facilities[i].name;
            for(var c in response){
              hay[c] = response[c];
            }
            res.push(angular.copy(hay));
          }
          console.log(res);
          return res;
        });
    };
    service.computeSchedule = function(facilities){

    };
    service.computeWastage = function(facilities){

    };
    service.computeBuffer = function(facilities){

    };
    service.getTemplate = function(templateID){
      return assumptionService.getAll()
    };
    service.getAllocations = function(facilities){

      function fillwithTemplate(facility, template){
        for(var i in template){ //Todo: adjust this to suit the new template structure
          facility['coverage'][template[i].product._id] = parseInt(template[i].coverage);
          facility['wastage'][template[i].product._id] = parseInt(template[i].wastage);
          facility['schedule'][template[i].product._id] = parseInt(template[i].schedule);
        }
        return facility;
      }
      function setAllocations (templateObj){
        facilities.forEach(function(facility){
          facility.coverage = {};
          facility.wastage  = {};
          facility.schedule = {};
          fillwithTemplate(facility, templateObj);
        });
        return facilities;
      }
      return service.getTemplate()
        .then(setAllocations)
    };
    /***
     *  calculates monthly requirements using allocation
     *  and target population
     * @param facilities: array
     * @returns {*} facilities inputed with MR(monthly requirement) field add to each
     */
    service.getMonthlyRequirement = function(facilities){
      return service.getAllocations(facilities)
        .then(service.getTargetPop)
        .then(function(r){
          for(i in facilities){
            for(v in r){
              if(r[v].facility._id === facilities[i]._id){
                facilities[i].annualU1 = parseInt(r[v].annualU1);
                facilities[i]['bi-weeklyU1'] = parseInt(r[v]['bi-weeklyU1']);
              }
            }
          }
          return facilities;
        })
        .then(function(response) {
          response.forEach(function (facility) {
            var productList = facility.coverage.keys();
            var index;
            for(pl in productList){
              index = productList[pl];
              facility.MR[productList[pl]] = (facility['bi-weeklyU1'] * 2) * facility.coverage[index] * facility.schedule[index] * facility.wastage[index];
            }

          });
          console.log(facilities);
          return facilities;
        });
    };
     service.getMonthlyMax = function(facilities){
      return service.getMonthlyRequirement(facilities)
        .then(function(response){
          response.each(function(facility){
            var mmax = facility.MR * (1 + facility.buffer);
            return Math.ceil(mmax)
          })
        })
    };
    service.getBiWeeklyMax = function(){

    };
    service.getBiWeeklyMin = function(facilities){

    }

});