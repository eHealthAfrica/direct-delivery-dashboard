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
    service.save = function(data){
      return dbService.save(data);
    };

    /**
     * updatelist is to look through product list
     * and add newly added product(s) to the assumptions list
     * @return array. the updated assumptions list
     * this should update vm data on controllers
     */
    service.updatelist = function(){

    }
  });