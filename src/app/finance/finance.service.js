'use strict'

angular.module('finance')
  .service('financeService', function (dbService, pouchUtil) {
    this.all = function () {
      var view = 'finance/all'
      var params = {}
      return dbService.getView(view, params)
        .then(pouchUtil.pluckValues)
    }
  })
