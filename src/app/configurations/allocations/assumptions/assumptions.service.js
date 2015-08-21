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
      return dbService.get(id)
        .then(function(response){
          return response;
        });
    };
    service.save = function(data){
      console.log(data);
      if(angular.isArray(data)){
        return dbService.saveDocs(data);
      }
      if(data.name){
        return dbService.insertWithId(data, data.name.trim());
      }
      return dbService.save(data);
    };

  });