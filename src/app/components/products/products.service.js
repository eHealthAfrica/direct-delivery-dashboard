/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .service('productService', function (pouchUtil, dbService) {

    this.baseUOMs = ['Units', 'Vials', 'Doses']

    this.get = function (id) {
      return dbService.get(id)
    }

    this.getAll = function () {
      var conf = {
        include_docs: true
      }
      var view = 'products/products'
      return dbService.getView(view, conf)
        .then(pouchUtil.pluckDocs)
    }

    this.getProductStorageType = function () {
      var params = {
        include_docs: true
      }
      var view = 'product-storages/product-storages'
      return dbService.getView(view, params)
        .then(pouchUtil.pluckDocs)
    }

    this.save = function (doc) {
      var use = 'update'
      if (!doc._id) {
        doc._id = doc.code // new product
      }
      if (!doc._rev) {
        use = 'insertWithId'
      }
      return dbService[use](doc)
    }
  })
