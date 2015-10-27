'use strict'

angular.module('allocations')
  .service('assumptionService', function (pouchUtil, dbService) {
    var service = this

    service.DOC_TYPES = {
      assumptions: 'assumptions',
      allocationTemplate: 'allocation_template'
    }

    service.getAll = function () {
      var view = 'allocations/all'
      var params = {
        include_docs: true
      }
      return dbService.getView(view, params)
        .then(pouchUtil.pluckDocs)
    }

    service.get = function (id) {
      return dbService.get(id)
    }

    service.save = function (data) {
      if (angular.isArray(data)) {
        return dbService.saveDocs(data)
      }
      if (data.name) {
        return dbService.insertWithId(data, data.name.trim().split(' ').join('-'))
      }
      return dbService.save(data)
    }
  })
