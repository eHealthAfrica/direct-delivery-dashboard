/**
 * Created by ehealthafrica on 8/22/15.
 */

angular.module('location')
  .service('locationCascadeService', function(locationService){
    var service = this;

    service.map = {
      countries: '0',
      regions: '1',
      states: '2',
      lgas: '3',
      wards: '4'
    };

    service.getCountries = function(){

    };

    service.getRegions = function(country){

    };

    service.getStates = function(){

    };

    service.getZones = function(state){

    };

    service.getLga = function(){

    }

  });