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

  _this.getAllTemplates = function () {
    var view = 'kpi-template/all'
    var param = {
      include_docs: true
    }
    return dbService.getView(view, param)
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
  }
})
