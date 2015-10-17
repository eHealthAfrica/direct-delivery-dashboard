'use strict'

angular.module('facility')
  .controller('FacilityAllCtrl', function (facilityService, log) {
    var vm = this
    vm.facilityStatus = {}
    vm.selected = {
      zone: '',
      lga: '',
      ward: ''
    }
    vm.list = {}

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
        vm.selectedLocation = vm.nestedFacilities.ward[vm.selected.zone][vm.selected.lga][vm.selected.ward]
        vm.selected.type = 'Ward'
        buildLocationList()
      } else if (vm.selected.lga) {
        vm.selectedLocation = vm.nestedFacilities.lga[vm.selected.zone][vm.selected.lga]
        vm.selected.type = 'LGA'
        buildLocationList()
      } else if (vm.selected.zone) {
        vm.selectedLocation = vm.nestedFacilities.zone[vm.selected.zone]
        vm.selected.type = 'Zone'
        buildLocationList()
      } else {
        buildLocationList()
        vm.selectedLocation = vm.nestedFacilities.zone[vm.selected.zone]
        vm.selected.type = 'Zone'
        vm.selected.name = vm.selected.zone
      }
    }

    function buildLocationList () {
      vm.list.zone = Object.keys(vm.nestedFacilities.zone).sort()
      vm.selected.zone = vm.selected.zone || vm.list.zone[0]
      vm.list.lga = Object.keys(vm.nestedFacilities.lga[vm.selected.zone] || {}).sort()
      vm.list.ward = vm.selected.lga ? Object.keys(vm.nestedFacilities.ward[vm.selected.zone][vm.selected.lga]).sort() : []
    }

    vm.updateStatus = function (report) {
      var facility = vm.locations.facility[report._id]
      facility.cceStatus = facility.cceStatus || []
      var status = {
        status: !vm.facilityStatus[report._id].status,
        date: new Date().toJSON()
      }
      facility.cceStatus.push(status)
      facilityService.save(facility)
        .then(function () {
          vm.facilityStatus[report._id].status = status.status
          vm.facilityStatus[report._id].date = status.date
        })
        .catch(function (reason) {
          console.log(reason)
        })
    }

    facilityService.getStateLocations()
      .then(function (response) {
        vm.facilities = response.facilities
        vm.locations = response.locations
        vm.nestedFacilities = response.nestedFacilities
        vm.zones = Object.keys(vm.nestedFacilities.zone)
        vm.selected.zone = vm.selected.zone || vm.zones[0]
        resetLocations()
        getSelectedLocation()
        setStatus(response.facilities)
      })
      .catch(function (reason) {
        log('unknownError', reason)
      })

    function setStatus (facilities) {
      var i = facilities.length
      while (i--) {
        vm.facilityStatus[facilities[i]._id] = facilities[i].status
      }
    }
  })
