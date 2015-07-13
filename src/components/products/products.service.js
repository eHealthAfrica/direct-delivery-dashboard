/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .service('productService', function(config,pouchDB, pouchUtil){

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
          return pouchUtil.pluckDocs(res);
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