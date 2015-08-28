/**
 * Created by ehealthafrica on 7/11/15.
 */

angular.module('allocations')
  .service('calculationService', function ($q, locationService, dbService, pouchUtil, assumptionService) {

    var service = this;

    service.template = {};

    service.setTemplate = function(template){
      service.template = template;
    };

    service.getLocation = function () {
      return locationService.get
    };
    service.getfacility = function () {
      return locationService.getLocationByLevel("6");
    };

    /**
     * gets target population data for facilities
     * @param facilities. object or array of facility objects, preferably from location service
     * @return facilities.  match each facility entered with corresponding returned
     * data.
     */
    service.getTargetPop = function (facilities) {
      var view = 'allocations/target-population',
        keys = [],
        options = {
          include_docs: true
        };

      if (angular.isArray(facilities)) {
        for ($i in facilities) {
          keys.push(facilities[$i]._id);
        }
      } else {
        keys.push(facilities._id);
      }
      options.keys = keys;
      return dbService.getView(view, options)
        .then(pouchUtil.pluckDocs);
    };


    service.getAllocations = function (facilities) {
      var deferred = $q.defer();
      function fillwithTemplate(facility, template) {
        for (var i in template.products) { //Todo: adjust this to suit the new template structure
          facility['coverage'][i] = parseInt(template.products[i].coverage);
          facility['wastage'][i] = template.products[i].wastage;
          facility['schedule'][i] = parseInt(template.products[i].schedule);
          facility['buffer'][i] = parseInt(template.products[i].buffer);
        }
        return facility;
      }

      function setAllocations(template) {

        facilities.forEach(function (facility) {
          facility.coverage = {};
          facility.wastage = {};
          facility.schedule = {};
          facility.buffer = {};
          fillwithTemplate(facility, template);
        });

        return facilities;
      }
      deferred.resolve(setAllocations(service.template));
      deferred.reject('Could not set allocations, please try again');
      return deferred.promise;
    };
    /***
     *  calculates monthly requirements using allocation
     *  and target population
     * @param facilities: array
     * @returns {*} facilities inputed with MR(monthly requirement) field add to each
     */
    service.getMonthlyRequirement = function (facilities) {
      return service.getAllocations(facilities)
        .then(service.getTargetPop)
        .then(function (r) {
          for (i in facilities) {
            for (v in r) {
              if (r[v].facility._id === facilities[i]._id) {
                facilities[i].annualU1 = parseInt(r[v].annualU1);
                facilities[i]['bi-weeklyU1'] = parseInt(r[v]['bi-weeklyU1']);
              }
            }
          }
          return facilities;
        })
        .then(function (response) {
          response.forEach(function (facility) {
            var productList = Object.keys(facility.coverage);
            var index;
            facility.MR = {};
            for (pl in productList) {
              index = productList[pl];
              facility.MR[productList[pl]] = Math.ceil((facility['bi-weeklyU1'] * 2) * (facility.coverage[index] / 100) * facility.schedule[index] * facility.wastage[index]);
            }

          });
          return facilities;
        });
    };
    function percentile(acc, per) {
      return (parseInt(acc) / 100) * parseInt(per);
    }

    service.getMonthlyMax = function (facilities) {

      function getMax(facility) {
        var r = {};
        for (var i in facility.MR) {
          r[i] = Math.ceil(facility.MR[i] * (1 + (facility.buffer[i] / 100)));
        }
        return r;
      }

      return service.getMonthlyRequirement(facilities)
        .then(function (response) {
          response.forEach(function (facility) {
            facility.MMax = getMax(facility);
            return facility;
          });

          return facilities;
        })
    };
    service.getBiWeekly = function (facilities) {
      function setBWMax(MMax) {
        var r = {};
        for (var i in MMax) {
          r[i] = Math.ceil(MMax[i] / 2);
        }
        return r;
      }

      function setBWMin(MMax) {
        var r = {};
        for (var i in MMax) {
          r[i] = Math.ceil(MMax[i] * 0.25);
        }
        return r;
      }

      return service.getMonthlyMax(facilities)
        .then(function (response) {
          for (var i in response) {
            response[i].BWMax = setBWMax(response[i].MMax);
            response[i].BWMin = setBWMin(response[i].MMax);
          }
          return response;
        })
    };

  });