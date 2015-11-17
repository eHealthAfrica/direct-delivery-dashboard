'use strict'

angular.module('drivers')
  .service('driversService', function (pouchDB, config, pouchUtil, dbService) {
    var db = pouchDB(config.db)
    this.all = function () {
      return db
        .query('drivers/drivers', {
          include_docs: true
        })
        .then(function (response) {
          var drivers = {}
          response.rows.forEach(function (row) {
            drivers[row.key] = row.doc
          })
          return drivers
        })
    }

    this.getByState = function (state) {
      var params = {
        key: state,
        include_docs: true
      }
      return dbService.getView('drivers/by_state', params)
        .then(pouchUtil.pluckDocs)
    }

    this.getSignUpEmail = function () {
      var params = {
        include_docs: true
      }
      return dbService.getView('drivers/signup-email', params)
        .then(pouchUtil.pluckDocs)
        .then(function (templates) {
          return templates[0]
        })
    }
  })
