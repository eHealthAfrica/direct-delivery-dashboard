'use strict';

/**
 * Utility class for managing the loading of places data (Zone, LGA, Ward, Facility).
 */
angular.module('lmisApp')
  .service('Places', function (State, Zone, LGA, Ward, Facility) {

    function Places(type, filter) {
      this.loading = true;

      var service = State;
      switch (parseInt(type)) {
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

    Places.STATE = 0;
    Places.ZONE = 1;
    Places.LGA = 2;
    Places.WARD = 3;
    Places.FACILITY = 4;

    return Places;
  });