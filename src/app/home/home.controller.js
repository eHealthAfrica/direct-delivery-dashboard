'use strict'

angular.module('directDeliveryDashboard')
  .controller('HomeCtrl', function (
    DELIVERY_STATUS,
    $window,
    roundReport,
    deliveryRoundService,
    log,
    utility,
    $scope
  ) {
    var vm = this // view models
    vm.isLoading = false

    vm.roundCodes = roundReport.roundInfo.roundCodes || []
    vm.roundReport = roundReport

    function setIsLoading (isLoading) {
      vm.isLoading = isLoading
    }

    vm.reportLateness = function () {
      if (!vm.roundReport) {
        return
      }
      var roundReport = vm.roundReport
      vm.onTime = [
        { key: 'Unknown', y: roundReport.onTimeMap['Unknown'] || 0, color: '#90C3D4' },
        { key: 'On time', y: roundReport.onTimeMap['On_time'] || 0, color: '#93C47D' },
        { key: 'Less than an hour late', y: roundReport.onTimeMap['An_hour_late'] || 0, color: 'orange' },
        { key: 'Less than six hours late', y: roundReport.onTimeMap['Less_than_six_hours_late'] || 0, color: '#F21142' },
        { key: 'A day late', y: roundReport.onTimeMap['A_day_late'] || 0, color: 'pink' },
        { key: 'A week late', y: roundReport.onTimeMap['A_week_late'] || 0, color: '#40030E' },
        { key: 'More than a week late', y: roundReport.onTimeMap['More_than_a_week_late'] || 0, color: 'red' }
      ]
    }
    vm.getLag = function () {
      if (!vm.roundReport.lag) {
        return
      }
      vm.lag = [
        {key: 'On scheduled date', y: vm.roundReport.lag.onDate || 0, color: '#93C47D'},
        {key: 'Before scheduled date', y: vm.roundReport.lag.beforeDate || 0, color: '#90C3D4'},
        {key: 'After scheduled date', y: vm.roundReport.lag.afterDate || 0, color: 'red'},
        {key: 'Unknown', y: vm.roundReport.lag.unknown || 0, color: '#90C3D4'}
      ]
    }

    vm.hasSchedules = function () {
      return vm.roundReport && vm.roundReport.total > 0
    }

    vm.showReport = function (round) {
      if (!round) {
        return
      }

      setIsLoading(true)
      deliveryRoundService.getReport(round)
        .then(function (rndReport) {
          rndReport.deliveryRoundID = round
          vm.roundReport = rndReport
          vm.setTimeline()
          vm.reportLateness()
          vm.getLag()
        })
        .catch(function (err) {
          vm.roundReport.onTimeMap = {}
          var reason = 'The round code was: ' + round
          log.error('missingRoundReport', err, reason)
        })
        .finally(setIsLoading.bind(null, false))
    }

    vm.onTimeColors = function () {
      return function (d) {
        return d.data.color
      }
    }

    vm.xPieFunction = function () {
      return function (d) {
        return d.key
      }
    }

    vm.yPieFunction = function () {
      return function (d) {
        return d.y
      }
    }

    vm.roundOff = function () {
      return function (d) {
        return $window.d3.round(d)
      }
    }

    vm.setTimeline = function () {
      if (!vm.roundReport.timeline) {
        return
      }
      var endDateLastHour = 82799000
      vm.scale = 'day'
      vm.data = [
        {
          name: 'Milestones',
          color: '#45607D',
          tasks: [
            {
              name: 'Progress',
              color: '#93C47D',
              from: utility.formatDate(vm.roundReport.timeline.startDate),
              to: new Date(vm.roundReport.timeline.markDate.getTime() + endDateLastHour),
              priority: 1 // enables progress to overlap end point
            },
            {
              name: 'End',
              color: '#FF0000',
              from: utility.formatDate(vm.roundReport.timeline.endDate),
              to: new Date(vm.roundReport.timeline.endDate.getTime() + endDateLastHour).toJSON(),
              priority: 0
            }
          ]
        }
      ]
      vm.roundReport.upcoming = vm.roundReport.total - (vm.roundReport.delivered + vm.roundReport.notWorkingCCE)
    }
    $scope.$on('stateChanged', function (event, data) {
      var key = ''
      deliveryRoundService.getLatestBy(data.state.name)
        .then(function (roundInfo) {
          vm.roundCodes = roundInfo.roundCodes || []
          vm.selectedRound = ''
          key = roundInfo.latestRoundId
          return deliveryRoundService.getReport(key)
        })
        .then(function (roundReport) {
          roundReport.deliveryRoundID = key
          vm.roundReport = roundReport
          if (roundReport.onTime || roundReport.behindTime > 0) {
            vm.onTime = [
              { key: 'Behind Time', y: roundReport.behindTime, color: 'orange' },
              { key: 'On Time', y: roundReport.onTime, color: 'green' }
            ]
          }
          vm.hasSchedules()
          vm.setTimeline()
        })
        .catch(function () {
          var defaultReport = deliveryRoundService.getDefaultReport()
          defaultReport.deliveryRoundID = key
          defaultReport.status = []
          vm.onTime = []
          vm.roundReport = defaultReport
          vm.hasSchedules()
          vm.setTimeline()
        })
    })
    vm.setTimeline()
    vm.reportLateness()
    vm.getLag()
  })
