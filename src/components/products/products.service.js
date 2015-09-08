/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .service('productService', function(pouchUtil, dbService){

    this.baseUOMs = ['Units', 'Viles', 'Doses'];

    this.get = function(id){
      return dbService.get(id);
    };

    this.getAll = function(){
      var conf = {
        include_docs : true
        };
      var view = "products/products";

      return dbService.getView(view, conf)
        .then(function(res){
          return pouchUtil.pluckDocs(res);
        });
    };

    this.getProductStorageType = function(){
      return dbService.getView('product-storages/product-storages', {
        include_docs: true
      })
        .then(pouchUtil.pluckDocs);
    };

    this.CategoriseByStorageType = function(){

    };

    this.getDryProducts = function(){

    };

    this.getColdProducts = function (){

    };

    this.getFrozenProducts = function(){

    };
    this.save = function(doc){
      return dbService.save(doc)
    }
  });