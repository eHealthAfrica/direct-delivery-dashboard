'use strict'

angular.module('reports')
  .controller('DeliveryReportCtrl', function (
    $window,
    config,
    reportsService,
    log,
    deliveryRoundService,
    $scope,
    authService
  ) {
    var vm = this // viewModel

    vm.dateFormat = config.dateFormat
    vm.stopOn = new Date()
    var ONE_MONTH = 2.62974e9 // milli secs
    var ONE_MONTH_BEFORE = vm.stopOn.getTime() - ONE_MONTH
    vm.startFrom = new Date(ONE_MONTH_BEFORE)

    function openDatePicker ($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.opened = !this.opened
    }

    function toggleLoading (loading) {
      loading = loading || false
      vm.isLoading = loading
    }

    vm.start = {
      opened: false,
      open: openDatePicker
    }

    vm.stop = {
      opened: false,
      open: openDatePicker
    }

    vm.formatXAxis = function () {
      return function (d) {
        return d
      }
    }

    vm.formatYAxis = function () {
      return function (d) {
        return [Math.round(d), '%'].join('')
      }
    }

    authService.getUserSelectedState()
      .then(function (state) {
        deliveryRoundService.getLatestBy(state)
          .then(function (response) {
            vm.roundCodes = response.roundCodes
          })
      })
    vm.zoneReport = []
    vm.statusReport = {}

    vm.getByRound = function (round) {
      if (!round) {
        return
      }
      toggleLoading(true)
      authService.getUserSelectedState(true)
        .then(function (state) {
          reportsService.getReportByRound(vm.selectedRound, state)
            .then(loadSuccess)
            .catch(function (err) {
              log.error('cumulativeReportErr', err)
            })
        })
        .finally(toggleLoading)
    }

    vm.getReport = function () {
      authService.getUserSelectedState('object')
        .then(function (state) {
          reportsService.getByWithin(state, vm.startFrom, vm.stopOn)
            .then(loadSuccess)
            .catch(function (err) {
              log.error('cumulativeReportErr', err)
            })
        })
    }

    vm.getChartData = function (zoneData) {
      var graphData = [
        {
          'key': 'Success',
          'color': 'green',
          'values': []
        },
        {
          'key': 'Failed',
          'color': 'red',
          'values': []
        },
        {
          'key': 'Canceled',
          'color': 'orange',
          'values': []
        }
      ]
      var length = zoneData.length

      for (var i = 0; i < length; i++) {
        var row = zoneData[i]
        var total = row.success + row.failed + row.canceled
        graphData[0].values.push([row.zone, getPercentile(total, row.success)])
        graphData[1].values.push([row.zone, getPercentile(total, row.failed)])
        graphData[2].values.push([row.zone, getPercentile(total, row.canceled)])
      }
      return graphData
    }

    function getPercentile (total, value) {
      var percent = 0
      if (total > 0) {
        percent = (value / total) * 100
      }
      return percent
    }

    function loadSuccess (res) {
      vm.zoneReport = res.zones
      vm.statusReport = res.status
      vm.exampleData = vm.getChartData(res.zones)
    }

    vm.getReport() // call on init
    $scope.$on('stateChanged', function (event, data) {
      var state = data.state
      vm.selectedRound = ''
      deliveryRoundService.getLatestBy(state.name)
        .then(function (response) {
          vm.roundCodes = response.roundCodes
        })
      vm.getReport()
    })
  })
  .controller('DeliveryReportByZonesCtrl', function (
    config,
    reportsService,
    log,
    deliveryReportService,
    deliveryRoundService,
    $scope,
    authService
  ) {
    var vm = this // viewModel
    // var state = $scope.selectedState

    function openDatePicker ($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.opened = !this.opened
    }

    function toggleLoading (loading) {
      loading = loading || false
      vm.isLoading = loading
    }

    vm.filteredReport = {
      start: {
        opened: false,
        open: openDatePicker
      },
      stop: {
        opened: false,
        open: openDatePicker
      }
    }

    vm.dateFormat = config.dateFormat
    var ONE_MONTH = 2.62974e9 // milli secs
    vm.stopDateOn = new Date()
    var TWO_MONTHS_BEFORE = vm.stopDateOn.getTime() - (ONE_MONTH * 2)
    vm.startDate = new Date(TWO_MONTHS_BEFORE)

    authService.getUserSelectedState()
      .then(function (state) {
        deliveryRoundService.getLatestBy(state)
          .then(function (response) {
            vm.roundCodes = response.roundCodes
          })
      })

    vm.loadReport = function () {
      authService.getUserSelectedState('object')
        .then(function (state) {
          deliveryReportService.getDailyDeliveryReport(vm.startDate, vm.stopDateOn, state)
            .then(function (deliveryStatusReport) {
              loadViewData(deliveryStatusReport)
            })
            .catch(function (reason) {
              log.error('deliveryReportErr', reason)
            })
        })
    }

    vm.splitResult = function (string, type) {
      var stringArr = string.split('-')
      return type === 'zone' ? stringArr[1] : stringArr[0]
    }

    vm.updateReport = function (round) {
      if (!round) {
        return
      }
      toggleLoading(true)
      deliveryReportService.getDailyDeliveryReportByRound(round)
        .then(function (deliveryStatusReport) {
          loadViewData(deliveryStatusReport)
        })
        .catch(function (reason) {
          log.error('deliveryReportErr', reason)
        })
        .finally(toggleLoading)
    }

    vm.sum = function (row) {
      var success = row.success || 0
      var failed = row.failed || 0
      var cancelled = row.canceled || 0
      return success + failed + cancelled
    }

    function loadViewData (deliveryStatusReport) {
      vm.byZoneByLGA = deliveryStatusReport.byZoneByLGA
      vm.byZoneByDriver = deliveryStatusReport.byZoneByDriver
      vm.byZoneByDriverKeys = Object.keys(deliveryStatusReport.byZoneByDriver).sort()
      vm.capturedZones = Object.keys(deliveryStatusReport.byZoneByLGA).sort()
      vm.selectedZone = vm.selectedZone || vm.capturedZones[0] || ''
    }

    vm.loadReport()

    $scope.$on('stateChanged', function (event, data) {
      var state = data.state
      vm.selectedRound = ''
      deliveryRoundService.getLatestBy(state.name)
        .then(function (response) {
          vm.roundCodes = response.roundCodes
        })
        .catch(function (reason) {
          log.error('deliveryReportErr', reason)
        })
      vm.loadReport()
    })
  })
