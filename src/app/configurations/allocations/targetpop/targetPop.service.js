/**
 * Created by ehealthafrica on 9/1/15.
 */

angular.module('allocations')
  .service('targetPopulationService',  function(dbService){

    var service = this;

    service.saveMany = function(docs){
      return dbService.saveDocs(docs);
    };

    service.update = function(doc){
      return  dbService.update(doc);
    }
  });