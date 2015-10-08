angular.module('reports')
  .controller('FacilityReportCtrl', function (facilityReportService, config) {
    var vm = this // viewModel

    vm.dateFormat = config.dateFormat
    vm.stopOn = new Date()
    var ONE_MONTH = 2.62974e9 // milli secs
    var ONE_MONTH_BEFORE = vm.stopOn.getTime() - ONE_MONTH
    vm.startFrom = new Date(ONE_MONTH_BEFORE)
    vm.hfWithCCEDown = []

    function openDatePicker ($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.opened = !this.opened
    }

    vm.start = {
      opened: false,
      open: openDatePicker
    }

    vm.stop = {
      opened: false,
      open: openDatePicker
    }

    vm.getReport = function () {
      facilityReportService.getHFStatusReport(vm.startFrom, vm.stopOn)
        .then(function (response) {
          vm.hfWithCCEDown = response.cceDown
        })
        .catch(function (reason) {})
    }

    vm.getReport()
  })
