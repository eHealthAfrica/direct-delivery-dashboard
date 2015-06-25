'use strict';

angular.module('location')
  .service('locationService', function(dbService, pouchUtil, $q) {

      var _this = this;

      _this.levels = function() {
        var view = 'location-level/all';
        var params = { include_docs: true };
        return dbService.getView(view, params)
            .then(pouchUtil.pluckDocs)
            .then(pouchUtil.rejectIfEmpty);
      };

      _this.getLocationsByLevel = function(level) {
        var locations = [];

        return $q.when(locations.filter(function(loc){
                  return (loc.level && loc.level.toString() === level.toString());
                })
            .sort(function(a, b){
              return a.name > b.name;
            }));
      };

  });
