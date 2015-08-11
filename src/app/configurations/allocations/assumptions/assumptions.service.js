/**
 * Created by ehealthafrica on 7/8/15.
 */

angular.module('allocations')
  .service('assumptionService', function(pouchDB, config, pouchUtil, log, productService, dbService){

    var db = pouchDB(config.db);
    var service = this;

    service.getAll = function(){
      var view = 'allocations/assumptions';
      var config = {
        include_docs : true
      };

      return db.query(view, config)
        .then(function(response){
          return pouchUtil.pluckDocs(response);
        })
        .catch(function(err){
          log.error(err);
          return err;
        });
    };
    service.get = function(id){
      //Todo: edit to fetch from  db
      return service.getAll()
        .then(function(response){
          return response[0];
        });
    };
    service.save = function(data){

      if(angular.isArray(data)){
        return dbService.saveDocs(data);
      }
      return dbService.save(data);
    };

  });