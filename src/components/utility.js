/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('utility', [])
  .service('utilityService', function(){
    var service = this;

    service.pluck = function (queryData){
      var pluckedData = [];

      for(row in queryData.rows){
        pluckedData.push(row.doc)
      }
      return pluckedData;
    }
  });