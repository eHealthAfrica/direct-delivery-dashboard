'use strict'

angular.module('kpi')
  .service('kpiService', function (dbService, pouchUtil) {
    var _this = this

    _this.getByRoundId = function (id) {
      var view = 'kpi/by-round-id'
      var param = {
        key: id,
        include_docs: true
      }
      var antigens = []
      return dbService.getView(view, param).then(function (res) {
        var kpiList = res.rows.map(function (row) {
          var kpi = row.doc
          if (angular.isArray(kpi.antigensKPI)) {
            kpi.antigensKPI.forEach(function (antigenKPI) {
              if (antigenKPI && antigenKPI.productID && antigens.indexOf(antigenKPI.productID) === -1) {
                antigens.push(antigenKPI.productID)
              }
            })
          }
          return kpi
        })
        return {
          antigens: antigens,
          kpiList: kpiList
        }
      })
    }

    function hash (driverId, date, facilityId) {
      return [driverId, date, facilityId].join('-')
    }

    function hashKPI (kpiList) {
      var kpiHash = {}
      kpiList.forEach(function (kpi) {
        if (kpi.facility && kpi.facility.id) {
          var key = hash(kpi.driverID, kpi.date, kpi.facility.id)
          kpiHash[key] = kpi
        }
      })
      return kpiHash
    }

    _this.fillInMissingKPI = function (kpiList, roundId, kpiTemplate) {
      var view = 'kpi/deliveries-date-and-driver-by-round'
      var param = {
        key: roundId
      }
      var kpiHash = hashKPI(kpiList)
      var result = angular.copy(kpiList)
      return dbService.getView(view, param)
        .then(function (res) {
          res.rows
            .forEach(function (row) {
              row = row.value
              var recordKey = hash(row.driverID, row.date, row.facility.id)
              if (!kpiHash[recordKey]) {
                var temp = angular.copy(kpiTemplate)
                temp.date = row.date
                temp.driverID = row.driverID
                temp.facility = row.facility
                result.push(temp)
              }
            })
          return result
        })
    }

    _this.getAllTemplates = function () {
      var view = 'kpi-template/all'
      var param = {
        include_docs: true
      }
      return dbService.getView(view, param)
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
    }

    _this.save = function (doc) {
      return dbService.save(doc)
    }

    _this.saveDocs = function (docs) {
      return dbService.saveDocs(docs)
    }
  })
