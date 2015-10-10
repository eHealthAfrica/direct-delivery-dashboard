'use strict';

angular.module('facility')
  .controller('FacilityModalCtrl', function (locationData, facilityData) {
    var vm = this;
    vm.facModel = {};
    vm.locations = locationData;
    vm.selectedLocation = {};
    vm.list = {
      zone: [],
      lga: [],
      ward: []
    };
    vm.selected = {
      zone: '',
      lga: '',
      ward: '',
      name: '',
      type: ''
    };

    vm.updateLocation = function (name, type) {
      vm.selected[type] = name;
      vm.selected.name = name;
      resetLocations(type);
      getSelectedLocation();
    };

    function resetLocations(type) {
      if (type === 'zone') {
        vm.selected.lga = '';
      }

      if (type === 'zone' || type === 'lga') {
        vm.selected.ward = '';
      }

      if (!type) {
        vm.selected.zone = '';
        vm.selected.lga = '';
        vm.selected.ward = '';
        vm.list.zone = [];
        vm.list.lga = [];
        vm.list.ward = [];
        vm.selectedLocation = {};
      }
    }

    function getSelectedLocation() {

      if (vm.selected.ward) {
        vm.selectedLocation = vm.locations[vm.selected.zone][vm.selected.lga][vm.selected.ward];
        vm.selected.type = 'Ward';
        buildLocationList();
      } else if (vm.selected.lga) {
        vm.selectedLocation = vm.locations[vm.selected.zone][vm.selected.lga];
        vm.selected.type = 'LGA';
        buildLocationList();
      } else if (vm.selected.zone) {
        vm.selectedLocation = vm.locations[vm.selected.zone];
        vm.selected.type = 'Zone';
        buildLocationList();
      } else {
        buildLocationList();
        vm.selectedLocation = vm.locations[vm.selected.zone];
        vm.selected.type = 'Zone';
        vm.selected.name = vm.selected.zone;
      }
    }

    function buildLocationList() {
      vm.list.zone = Object.keys(vm.locations).sort();
      vm.selected.zone = vm.selected.zone || vm.list.zone[0];
      vm.list.lga = Object.keys(vm.locations[vm.selected.zone] || {}).sort();
      vm.list.ward = vm.selected.lga ? Object.keys(vm.locations[vm.selected.zone][vm.selected.lga]).sort() : [];
    }

    resetLocations();
    getSelectedLocation();

  });