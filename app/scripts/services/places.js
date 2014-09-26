'use strict';

/**
 * Utility class for managing the loading of places data (Zone, LGA, Ward, Facility).
 */
angular.module('lmisApp')
  .service('Places', function (State, Zone, LGA, Ward, Facility) {

    function Places(type, filter) {
      this.loading = true;

      var service = State;
      switch (type) {
        case Places.ZONE:
          service = Zone;
          break;
        case Places.LGA:
          service = LGA;
          break;
        case Places.WARD:
          service = Ward;
          break;
        case Places.FACILITY:
          service = Facility;
          break;
      }

      this.promise = service.names(filter)
        .finally(function () {
          this.loading = false;
        }.bind(this));
    }

    Places.subType = function(type) {
      switch (type) {
        case Places.STATE:
          return Places.ZONE;
        case Places.ZONE:
          return Places.LGA;
        case Places.LGA:
          return Places.WARD;
        case Places.WARD:
          return Places.FACILITY;
        default:
          return undefined;
      }
    };

    Places.typeName = function(type, plural) {
      switch (type) {
        case Places.STATE:
          return plural ? 'States' : 'State';
        case Places.ZONE:
          return plural ? 'Zones' : 'Zone';
        case Places.LGA:
          return plural ? 'LGAs' : 'LGA';
        case Places.WARD:
          return plural ? 'Wards' : 'Ward';
        case Places.FACILITY:
          return plural ? 'Facilities' : 'Facility';
        default:
          return '';
      }
    };

    Places.STATE = 'state';
    Places.ZONE = 'zone';
    Places.LGA = 'lga';
    Places.WARD = 'ward';
    Places.FACILITY = 'facility';

    return Places;
  });