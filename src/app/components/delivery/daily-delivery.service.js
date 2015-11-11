'use strict'

angular.module('delivery')
  .service('deliveryService', function (dbService, pouchUtil) {
    this.getByRoundId = function (roundId) {
      var view = 'daily-deliveries/by-round'
      var params = {}
      if (angular.isString(roundId) || angular.isArray(roundId)) {
        params = pouchUtil.key(roundId)
      }
      params.include_docs = true
      return dbService.getView(view, params)
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
    }
  })
