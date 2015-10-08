'use strict'

angular.module('planning')
  .service('returnRouteService', function (dbService, pouchUtil, $q, $filter, utility, log) {
    var _this = this

    function shouldAdd (doc, collatedList) {
      var key = getDocKey(doc)
      return (doc.driverID && doc.deliveryDate && collatedList.indexOf(key) === -1)
    }

    function getDocKey (doc) {
      return [ doc.driverID, doc.deliveryDate ].join('-')
    }

    function getReturnRoute (rows, collatedList, type) {
      var list = []
      rows.forEach(function (row) {
        var doc = row[type]
        if (doc) {
          var key = getDocKey(doc)
          if (shouldAdd(doc, collatedList)) {
            if (utility.isValidDate(doc.modifiedOn)) {
              doc.modifiedOn = $filter('date')(new Date(doc.modifiedOn), 'dd-MM-yyyy H:mm')
            }
            list.push(doc)
            collatedList.push(key)
          }
        }
      })
      return list
    }

    _this.getBy = function (roundId) {
      var view = 'return-route/by-round-id'
      var params = {
        key: roundId,
        include_docs: true
      }
      var ddView = 'return-route/daily-deliveries-by-round-id'
      var promises = {
        returnRoutes: dbService.getView(view, params),
        dailyDeliveries: dbService.getView(ddView, { key: roundId })
      }
      return $q.all(promises)
        .then(function (res) {
          var alreadyCollated = []
          var returnRoutes = getReturnRoute(res.returnRoutes.rows, alreadyCollated, 'doc')
          var newDailyReturnRoutes = getReturnRoute(res.dailyDeliveries.rows, alreadyCollated, 'value')
          return returnRoutes.concat(newDailyReturnRoutes)
        })
    }

    _this.save = function (doc) {
      doc.doc_type = 'return-route'
      if (doc._id) {
        return dbService.update(doc)
      }
      return dbService.insert(doc)
    }

    _this.onSaveError = function (err) {
      if (err.status === 401) {
        return log.error('unauthorizedAccess', err)
      }
      if (err.status === 409) {
        return log.error('updateConflict', err)
      }
      return log.error('saveReturnRouteErr', err)
    }

    _this.getPackingStoreBy = function (state) {
      // TODO: update to query db after ticket #113
      var packingStores = [
        {
          _id: 'STATE-STORE',
          name: 'Kano State Store',
          state: 'Kano'
        },
        {
          _id: 'NASSARAWA-ZONAL-STORE',
          name: 'Nassarawa Zonal Store',
          state: 'Kano'
        },
        {
          _id: 'RANO-ZONAL-STORE',
          name: 'Rano Zonal Store',
          state: 'Kano'
        },
        {
          _id: 'WUDIL-ZONAL-STORE',
          name: 'Wudil Zonal Store',
          state: 'Kano'
        }
      ]
      return $q.when(packingStores.filter(function (row) {
        return row.state.toLowerCase() === state.toLowerCase()
      }))
    }
  })
