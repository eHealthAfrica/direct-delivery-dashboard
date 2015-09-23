'use strict';

angular.module('Measurements')
  .service('measurementService', function(dbService, pouchUtil){

    var _this = this;

    _this.get = function(id){
      return dbService.get(id);
    };

    _this.getAll = function(){
      var view = 'measurements/categories';
      var opts = {
        include_docs: true
      };
      return dbService.getView(view, opts)
        .then(pouchUtil.pluckDocs);
    };

    _this.save = function(doc){

      if(!doc.doc_type){
        doc.doc_type = 'measurement_category';
      }
      if(!doc.is_deleted){
        doc.is_deleted = false;
      }
      if(!doc._id){
        doc._id = doc.name;
        return dbService.insertWithId(doc);
      }

      return dbService.update(doc);
    }
});