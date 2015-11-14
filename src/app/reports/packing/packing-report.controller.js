'use strict'

angular.module('reports')
  .controller('PackingReportCtrl', function (
    $window,
    config,
    log,
    packingReportService,
    deliveryRoundService,
    $scope
  ) {
    var vm = this // viewModel
    vm.selectedLocation = {}
    var state = $scope.selectedState
    vm.list = {
      zone: [],
      lga: [],
      ward: []
    }
    vm.selected = {
      zone: '',
      lga: '',
      ward: '',
      name: '',
      type: ''
    }

    vm.dateFormat = config.dateFormat
    vm.stopOn = new Date()
    var ONE_MONTH = 2.62974e9 // milli secs
    var ONE_MONTH_BEFORE = vm.stopOn.getTime() - (ONE_MONTH * 3)
    vm.startFrom = new Date(ONE_MONTH_BEFORE)
    vm.currentRow = ''
    vm.previousRow = ''
    vm.rowList = {}

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

    vm.updateLocation = function (name, type) {
      vm.selected[type] = name
      vm.selected.name = name
      resetLocations(type)
      getSelectedLocation()
    }

    function resetLocations (type) {
      if (type === 'zone') {
        vm.selected.lga = ''
      }

      if (type === 'zone' || type === 'lga') {
        vm.selected.ward = ''
      }

      if (!type) {
        vm.selected.zone = ''
        vm.selected.lga = ''
        vm.selected.ward = ''
        vm.list.zone = []
        vm.list.lga = []
        vm.list.ward = []
        vm.selectedLocation = {}
      }
    }

    function getSelectedLocation () {
      if (vm.selected.ward) {
        vm.selectedLocation = vm.reports.ward[vm.selected.zone][vm.selected.lga][vm.selected.ward]
        vm.selected.type = 'Ward'
        buildLocationList()
      } else if (vm.selected.lga) {
        vm.selectedLocation = vm.reports.lga[vm.selected.zone][vm.selected.lga]
        vm.selected.type = 'LGA'
        buildLocationList()
      } else if (vm.selected.zone) {
        vm.selectedLocation = vm.reports.zone[vm.selected.zone]
        vm.selected.type = 'Zone'
        buildLocationList()
      } else {
        buildLocationList()
        vm.selectedLocation = vm.reports.zone[vm.selected.zone]
        vm.selected.type = 'Zone'
        vm.selected.name = vm.selected.zone
      }
    }

    function buildLocationList () {
      vm.list.zone = Object.keys(vm.reports.zone).sort()
      vm.selected.zone = vm.selected.zone || vm.list.zone[0]
      vm.list.lga = Object.keys(vm.reports.lga[vm.selected.zone] || {}).sort()
      vm.list.ward = vm.selected.lga ? Object.keys(vm.reports.ward[vm.selected.zone][vm.selected.lga]).sort() : []
    }

    vm.getReport = function () {
      packingReportService.getPackingReport(vm.startFrom, vm.stopOn, state)
        .then(function (response) {
          setViewVars(response)
        })
    }

    vm.updateReport = function () {
      packingReportService.getPackingReportByRound(vm.selectedRound)
        .then(function (response) {
          setViewVars(response)
        })
    }

    deliveryRoundService.getLatestBy(state.name)
      .then(function (response) {
        vm.roundCodes = response.roundCodes
      })

    vm.getReport()

    function setViewVars (response) {
      vm.reports = response.group
      vm.products = response.products
      resetLocations()
      getSelectedLocation()
    }

    $scope.$on('stateChanged', function (event, data) {
      state = data.state
      vm.selectedRound = ''
      deliveryRoundService.getLatestBy(state.name)
        .then(function (response) {
          vm.roundCodes = response.roundCodes
        })
      vm.getReport()
    })
  })
