'use strict'

angular.module('reports')
  .service('deliveryReportService', function (reportsService, dbService) {
    function defaultStatus () {
      return {
        success: 0,
        failed: 0,
        canceled: 0
      }
    }

    function groupByZoneByDriver (grouped, row) {
      var key = [row.driverID, row.zone].join('-')
      if (!grouped.hasOwnProperty(key)) {
        grouped[key] = defaultStatus()
      }
      grouped[key][row.status]++

      return grouped
    }

    function groupByZoneByLGA (grouped, row) {
      if (!grouped.hasOwnProperty(row.zone)) {
        grouped[row.zone] = {}
      }
      if (!grouped[row.zone].hasOwnProperty(row.lga)) {
        grouped[row.zone][row.lga] = defaultStatus()
      }
      grouped[row.zone][row.lga][row.status]++

      return grouped
    }

    function collateReport (response) {
      response = response.rows
      var index = response.length
      var groupedByZoneByDriver = {}
      var groupedByZoneByLGA = {}

      while (index--) {
        var row = response[index].value
        groupedByZoneByDriver = groupByZoneByDriver(groupedByZoneByDriver, row)
        groupedByZoneByLGA = groupByZoneByLGA(groupedByZoneByLGA, row)
      }

      return {
        byZoneByDriver: groupedByZoneByDriver,
        byZoneByLGA: groupedByZoneByLGA
      }
    }

    this.getDailyDeliveryReport = function (startDate, endDate) {
      var view = 'dashboard-delivery-rounds/report-by-date'
      startDate = new Date(startDate).toJSON()
      endDate = new Date(endDate).toJSON()
      var options = {
        startkey: [startDate],
        endkey: [endDate, {}, {}]
      }
      return dbService.getView(view, options)
        .then(collateReport)
    }

    this.getDailyDeliveryReportByRound = function (roundID) {
      var view = 'reports/by-rounds'
      var options = {
        startkey: [roundID],
        endkey: [roundID, {}, {}]
      }
      return dbService.getView(view, options)
        .then(collateReport)
    }
  })
