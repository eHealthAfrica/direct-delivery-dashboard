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
        var view = 'location/by-level';
        var params = {
          include_docs: true,
          key: level
        };
        return dbService.getView(view, params)
            .then(pouchUtil.pluckDocs)
            .then(pouchUtil.rejectIfEmpty);
      };

      _this.getByLevelAndAncestor = function(keys) {
        var view = 'location/by-level-and-ancestors-id';
        var params = {
          include_docs: true,
          keys: keys
        };
        return dbService.getView(view, params)
            .then(pouchUtil.pluckDocs);
      };

      _this.getByIds = function(keys) {
        var view = 'location/by-ancestors-id';
        var params = {
          include_docs: true,
          keys: keys
        };
        return dbService.getView(view, params)
            .then(pouchUtil.pluckDocs);
      };

  });
