'use strict'

angular.module('reports')
  .controller('ReportsAllCtrl', function (reportsService, deliveryRounds, log, $scope) {
    var vm = this
    vm.deliveryRounds = deliveryRounds.results || []
    vm.pagination = {
      limit: 10,
      page: 1
    }

    vm.getReport = function (page) {
      vm.pagination.page = page || vm.pagination.page
      vm.pagination.skip = (vm.pagination.page - 1) * vm.pagination.limit
      reportsService.getDeliveryRounds(vm.pagination)
        .then(function (response) {
          vm.deliveryRounds = response.results
          vm.pagination.totalItems = response.total
          getLastPage()
        })
        .catch(function (reason) {
          log.error('invoiceRoundListErr', reason)
        })
    }

    vm.getReport()

    vm.allIn = function () {
      return vm.pagination.totalItems <= vm.pagination.limit
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
      vm.pagination.lastPage = Math.ceil(vm.pagination.totalItems / vm.pagination.limit)
      return vm.pagination.lastPage
    }

    $scope.$on('stateChanged', function (event, data) {
      vm.pagination.page = 1
      vm.getReport()
    })
  })
