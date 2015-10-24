'use strict'

angular.module('reports')
  .controller('ReportsAllCtrl', function (reportsService) {
    var vm = this
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
          vm.pagination.offset = response.offset
        })
    }

    vm.getReport()

    vm.allIn = function () {
      return vm.pagination.totalItems <= vm.pagination.limit
    }
  })
