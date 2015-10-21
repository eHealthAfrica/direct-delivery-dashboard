'use strict'

angular.module('reports')
  .service('reportsService', function (
    $q,
    dbService,
    deliveryRoundService,
    locationService,
    pouchUtil,
    authService,
    ehaCouchDbAuthService
  ) {
    var _this = this

    this.getDeliveryRounds = function () {
      return dbService.getView('reports/delivery-rounds')
        .then(pouchUtil.pluckValues)
    }

    this.getDailyDeliveries = function (roundId) {
      var view = 'reports/daily-deliveries'
      var params = {
        startkey: [roundId],
        endkey: [roundId, {}, {}, {}]
      }
      return dbService.getView(view, params)
        .then(pouchUtil.pluckValues)
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
      var view = 'dashboard-delivery-rounds/report-by-date'
      startDate = new Date(startDate).toJSON()
      endDate = new Date(endDate).toJSON()
      var options = {
        startkey: [startDate],
        endkey: [endDate, {}, {}]
      }

      function getLocations () {
        function branchByUser (user) {
          // TODO: move into config
          var ZONE_LEVEL = '3'

          if (user.isAdmin()) {
            return locationService.getLocationsByLevel(ZONE_LEVEL)
          }
          var states = authService.authorisedStates(user)
          if (states.length) {
            // TODO: display a dropdown on the frontend if the user can access
            // more than state?
            var state = states[0]
            var locKeys = [ZONE_LEVEL, state]
            return locationService.getByLevelAndAncestor(locKeys)
          }
          return []
        }

        return ehaCouchDbAuthService.getCurrentUser()
          .then(branchByUser.bind(null))
      }

      var promises = [
        dbService.getView(view, options),
        getLocations()
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
