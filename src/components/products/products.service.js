/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .service('productService', function(config,pouchDB, utilityService){

    var db = pouchDB(config.db);


    this.productsListMock = [
      {}
    ];

    this.getAll = function(){
      var conf = {
        include_docs : true
        };
      var view = "products/products";

      return db.query(view, conf)
        .then(function(res){
          return utilityService.pluck(res);
        });
    };

    this.CategoriseByStorageType = function(){

    };

    this.getDryProducts = function(){

    };

    this.getColdProducts = function (){

    };

    this.getFrozenProducts = function(){

    };

  });