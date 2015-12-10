'use strict'

angular.module('reports')
  .controller('ReportsRoundCtrl', function ($stateParams, $window, drivers, ZONE_CLASS, reportsService, dailyDeliveries, log, $timeout, APP_CONSTANTS) {
    var vm = this
    var keys = ['driverID', 'date']
    var keyRows = {}
    var lastKeyValues = []
    vm.deliveryRound = $stateParams.id
    vm.pagination = {
      limit: 10,
      page: 1,
      lastPage: 1
    }
    vm.limits = APP_CONSTANTS.pageSizes

    vm.drivers = drivers
    vm.zoneClass = {}

    vm.keyStates = function (delivery, index) {
      var states = {}
      var value = ''
      angular.forEach(keys, function (key) {
        value += delivery[key]

        states[key] = {
          rows: keyRows[value],
          changed: !lastKeyValues[index - 1] || value !== lastKeyValues[index - 1][key]
        }

        if (!lastKeyValues[index]) {
          lastKeyValues[index] = {}
        }

        lastKeyValues[index][key] = value
      })

      return states
    }

    vm.print = function (all) {
      if (all) {
        vm.pagination.limit = 0
        vm.getReport(1).then(function () {
          $timeout(function () {
            $window.jQuery('#report').print()
          })
        })
      } else {
        $window.jQuery('#report').print()
      }
    }
    vm.dailyDeliveries = dailyDeliveries.results
    if (!vm.dailyDeliveries.length) {
      log.warning('noInvoiceData')
    }
    formatReport()

    vm.getReport = function (page) {
      var all
      keyRows = {}
      lastKeyValues = []
      vm.pagination.page = page || vm.pagination.page
      vm.pagination.skip = (vm.pagination.page - 1) * vm.pagination.limit
      if (parseInt(vm.pagination.limit, 10) === 0) {
        vm.pagination = {}
        all = true
      }
      return reportsService.getDailyDeliveries($stateParams.id, vm.pagination)
        .then(loadReport)
        .then(function () {
          if (all) {
            vm.pagination.limit = 0
          }
        })
        .catch(function (reason) {
          log.error('invoiceDailyDeliveryErr', reason)
        })
    }

    vm.allIn = function () {
      return (vm.pagination.totalItems <= vm.pagination.limit) || angular.isUndefined(vm.pagination.limit)
    }
    vm.hasPrev = function () {
      return vm.pagination.page > 1
    }

    vm.hasNext = function () {
      return vm.pagination.page !== getLastPage()
    }
    vm.selectPage = function (type) {
      if (type === 'next' && vm.hasNext()) {
        vm.pagination.page++
        vm.getReport()
      } else if (type === 'prev' && vm.hasPrev()) {
        vm.pagination.page--
        vm.getReport()
      }
    }

    function getLastPage () {
      if (!vm.pagination.limit) {
        vm.pagination.lastPage = 1
        vm.pagination.page = 1
      } else {
        vm.pagination.lastPage = Math.ceil(vm.pagination.totalItems / vm.pagination.limit)
      }
      return vm.pagination.lastPage
    }

    function loadReport (response) {
      vm.dailyDeliveries = response.results
      vm.pagination.totalItems = response.total
      vm.pagination.lastPage = isNaN(getLastPage()) ? getLastPage() : 1
      return formatReport()
    }

    function formatReport () {
      angular.forEach(vm.dailyDeliveries, function (delivery) {
        var value = ''
        angular.forEach(keys, function (key) {
          value += delivery[key]
          if (keyRows[value]) {
            keyRows[value]++
          } else {
            keyRows[value] = 1
          }
        })
      })
    }
    vm.getReport()
  })
