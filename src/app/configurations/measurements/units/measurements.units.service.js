'use strict';

angular.module('Measurements')
  .service('measurementsUnitService', function(dbService, pouchUtil){
    var _this = this;

    _this.get = function(id){
      return dbService.get(id);
    };

    _this.getAll = function(){

      var view = 'measurements/units';
      var opts = {
        include_docs: true
      };

      return dbService.getView(view, opts)
        .then(pouchUtil.pluckDocs)
    };

    _this.save = function(doc){
      var useMethod = 'update';
      if(!doc._id){
        doc._id = doc.symbol;
        useMethod = 'insertWithId';
      }
      if(!doc.doc_type){
        doc.doc_type ='measurement_unit';
      }
      return dbService[useMethod](doc)
    }
  });