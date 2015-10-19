'use strict'

angular.module('reports')
  .service('facilityReportService', function (dbService) {
    var _this = this

    function groupByFacility (list) {
      var grouped = {}
      var i = list.length
      while (i--) {
        var row = list[i].value
        var date = list[i].key[0]
        var key = [
          row.zone.trim(),
          row.lga.trim(),
          row.ward.trim(),
          row.name.trim()
        ].join('#')
        if (!grouped.hasOwnProperty(key)) {
          grouped[key] = []
        }
        row.date = date
        grouped[key].push(row)
      }

      return grouped
    }

    function collateReport (response) {
      var groupedByFacility = groupByFacility(response.rows)
      var hfWithFaultyCCE = []
      for (var key in groupedByFacility) {
        if (groupedByFacility.hasOwnProperty(key)) {
          var currentReport = groupedByFacility[key].sort(function (a, b) {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })[0]

          if (currentReport.workingCCE === false) {
            hfWithFaultyCCE.push(currentReport)
          }
        }
      }

      return {
        byFacility: groupedByFacility,
        cceDown: hfWithFaultyCCE
      }
    }

    _this.getHFStatusReport = function (startDate, endDate) {
      startDate = new Date(startDate).toJSON()
      endDate = new Date(endDate).toJSON()

      var params = {
        endkey: [endDate, {}, {}]
      }
      var view = 'facilities/cce-status-by-date'

      return dbService.getView(view, params)
        .then(collateReport)
    }
  })
