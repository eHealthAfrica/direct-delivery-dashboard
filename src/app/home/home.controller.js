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
    vm.selectedRound = ''

    vm.roundCodes = roundReport.roundInfo.roundCodes || []
    vm.roundReport = roundReport
    vm.onTime = []

    if (roundReport.onTime || roundReport.behindTime > 0) {
      vm.onTime = [
        { key: 'Behind Time', y: roundReport.behindTime, color: 'orange' },
        { key: 'On Time', y: roundReport.onTime, color: 'green' }
      ]
    }

    vm.hasSchedules = function () {
      return vm.roundReport && vm.roundReport.total > 0
    }

    vm.showReport = function () {
      deliveryRoundService.getReport(vm.selectedRound)
        .then(function (rndReport) {
          rndReport.deliveryRoundID = vm.selectedRound
          vm.roundReport = rndReport
          vm.setTimeline()
        })
        .catch(function (err) {
          var msg = [
            'Report for Round:',
            vm.selectedRound,
            'does not exist!'
          ].join(' ')
          log.error('', err, msg)
        })
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
    }
    $scope.$on('stateChanged', function (event, data) {
      var key = ''
      deliveryRoundService.getLatestBy(data.state.name)
        .then(function (roundInfo) {
          vm.roundCodes = roundInfo.roundCodes || []
          key = roundInfo.latestRoundId
          vm.selectedRound = ''
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
  })
