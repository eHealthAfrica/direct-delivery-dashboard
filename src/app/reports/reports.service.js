'use strict'

angular.module('reports')
  .service('reportsService', function ($q, pouchDB, config, dbService, deliveryRoundService, locationService) {
    var _this = this
    var db = pouchDB(config.db)

    // TODO: most of there should be moved to Server side if we start using server side rendering engine
    // or move to CouchDB
    this.getDeliveryRounds = function () {
      return db.query('reports/delivery-rounds')
        .then(function (response) {
          // TODO: move this to CouchDB view
          return response.rows.map(function (row) {
            return {
              id: row.id,
              state: row.key[0],
              startDate: new Date(row.key[1]),
              endDate: new Date(row.value.endDate),
              roundCode: row.value.roundCode
            }
          })
        })
    }

    this.getDailyDeliveries = function (roundId) {
      return db
        .query('reports/daily-deliveries', {
          startkey: [roundId],
          endkey: [roundId, {}, {}, {}]
        })
        .then(function (response) {
          // TODO: move this to CouchDB view
          return response.rows.map(function (row) {
            return {
              id: row.id,
              driverID: row.key[1],
              date: new Date(row.key[2]),
              drop: row.key[3],
              status: row.value.status,
              window: row.value.window,
              signature: row.value.signature,
              facility: row.value.facility
            }
          })
        })
    }

    _this.getStatusTypes = function () {
      return {
        success: 0,
        failed: 0,
        canceled: 0,
        total: 0
      }
    }

    _this.collateStatusByZone = function (zoneReport, rowZone, rowStatus) {
      if (!zoneReport[rowZone]) {
        zoneReport[rowZone] = _this.getStatusTypes()
      }
      zoneReport[rowZone][rowStatus] += 1
      return zoneReport
    }

    function collateSortedDate (ddReports) {
      var cumDayCount = {}
      ddReports
        .sort(function (a, b) {
          // ascending
          return (new Date(a.date) - new Date(b.date))
        })
        .forEach(function (row) {
          if (row.date) {
            if (!cumDayCount[row.date]) {
              cumDayCount[row.date] = _this.getStatusTypes()
            }
            cumDayCount[row.date][row.status] += 1
          }
        })
      return cumDayCount
    }

    function formatZones (zones) {
      var length = zones.length
      var formatted = {}
      for (var i = 0; i < length; i++) {
        var statusType = _this.getStatusTypes()
        statusType.zone = zones[i].name
        formatted[zones[i].name.toLowerCase()] = statusType
      }
      return formatted
    }

    function toList (object) {
      var list = []
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          list.push(object[key])
        }
      }
      return list
    }

    _this.collateReport = function (res, deliveryRounds, zones) {
      // TODO: move this collation to reduce view if possible
      var rows = res.rows

      var index = rows.length
      var report = {
        zones: {},
        dates: {},
        status: _this.getStatusTypes()
      }

      var row
      var roundRows = []
      while (index--) {
        row = rows[index].value
        if (deliveryRounds && row.deliveryRoundID && deliveryRounds.indexOf(row.deliveryRoundID) === -1) {
          continue // skip
        }
        roundRows.push(row)
        var rowZone = row.zone.trim().toLowerCase()
        var rowStatus = row.status.trim().toLowerCase()

        // collate report
        report.zones = _this.collateStatusByZone(report.zones, rowZone, rowStatus)
        report.status[rowStatus] += 1
        report.status.total += 1
      }

      zones = formatZones(zones)
      for (var z in report.zones) {
        if (report.zones.hasOwnProperty(z) && zones.hasOwnProperty(z)) {
          zones[z].success = report.zones[z].success
          zones[z].failed = report.zones[z].failed
          zones[z].canceled = report.zones[z].canceled
        }
      }
      console.log(zones)
      report.zones = toList(zones)
      report.dates = collateSortedDate(roundRows)
      return report
    }

    _this.getDeliveryReportWithin = function (startDate, endDate, deliveryRounds) {
      var ZONE_LEVEL = '3'
      var STATE_CODE = 'KN' // TODO: get this from user profile
      var view = 'dashboard-delivery-rounds/report-by-date'
      startDate = new Date(startDate).toJSON()
      endDate = new Date(endDate).toJSON()
      var options = {
        startkey: [startDate],
        endkey: [endDate, {}, {}]
      }
      var locKeys = []
      locKeys.push([ZONE_LEVEL, STATE_CODE])
      var promises = [
        dbService.getView(view, options),
        locationService.getByLevelAndAncestor(locKeys)
      ]
      return $q.all(promises)
        .then(function (res) {
          return _this.collateReport(res[0], deliveryRounds, res[1])
        })
    }

    _this.getByWithin = function (state, startDate, endDate) {
      var params = {
        startkey: [state],
        endkey: [state, {}]
      }

      return deliveryRoundService.getBy(params)
        .then(function (res) {
          var deliveryRoundIds = []
          res.rows.forEach(function (row) {
            deliveryRoundIds.push(row.id)
          })
          return _this.getDeliveryReportWithin(startDate, endDate, deliveryRoundIds)
        })
    }
  })
