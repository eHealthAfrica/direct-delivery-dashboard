'use strict'

angular.module('products')
  .service('productPresentationService', function (dbService, pouchUtil) {
    var _this = this

    _this.get = function (id) {
      return dbService.get(id)
    }

    _this.getAll= function () {
      var view = 'products/presentations'
      var opts = {
        include_docs: true
      }

      return dbService.getView(view, opts)
        .then(pouchUtil.pluckDocs)
    }

    _this.getByBaseUOM = function () {} // will there ever be a use case for this?

    _this.save = function (doc) {
      var use = 'update'
      if (!doc.doc_type) {
        doc.doc_type = 'product_presentation'
      }
      if (!doc._id) {
        doc._id = doc.code
        use = 'insertWithId'
      }

      return dbService[use](doc)
    }
  })
