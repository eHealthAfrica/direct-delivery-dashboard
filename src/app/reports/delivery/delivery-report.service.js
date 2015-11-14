'use strict'

angular.module('reports')
  .service('deliveryReportService', function ($q, dbService, deliveryRoundService) {
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

    function collateReport (response, deliveryRounds) {
      response = response.rows
      var index = response.length
      var groupedByZoneByDriver = {}
      var groupedByZoneByLGA = {}

      while (index--) {
        var row = response[index].value
        if (deliveryRounds && deliveryRounds.indexOf(row.deliveryRoundID) === -1) {
          continue // skip
        }
        groupedByZoneByDriver = groupByZoneByDriver(groupedByZoneByDriver, row)
        groupedByZoneByLGA = groupByZoneByLGA(groupedByZoneByLGA, row)
      }

      return {
        byZoneByDriver: groupedByZoneByDriver,
        byZoneByLGA: groupedByZoneByLGA
      }
    }

    this.getDailyDeliveryReport = function (startDate, endDate, state) {
      var view = 'dashboard-delivery-rounds/report-by-date'
      startDate = new Date(startDate).toJSON()
      endDate = new Date(endDate).toJSON()
      var options = {
        startkey: [startDate],
        endkey: [endDate, {}, {}]
      }

      var params = {
        startkey: [state.name],
        endkey: [state.name, {}]
      }

      var promises = [
        dbService.getView(view, options),
        deliveryRoundService.getBy(params)
      ]

      return $q.all(promises)
        .then(function (response) {
          var deliveryRoundIds = []
          response[1].rows.forEach(function (row) {
            deliveryRoundIds.push(row.id)
          })
          return collateReport(response[0], deliveryRoundIds)
        })
    }

    this.getDailyDeliveryReportByRound = function (roundID) {
      var view = 'reports/by-rounds'
      var options = {
        startkey: [roundID],
        endkey: [roundID, {}, {}]
      }
      return dbService.getView(view, options)
        .then(function (response) {
          return collateReport(response, [roundID])
        })
    }
  })
