'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsWardsCtrl', function (locationService, log) {
    var vm = this
    vm.states = []
    vm.zones = []
    vm.lgas = []
    vm.result = []
    vm.csv = {
      separator: ',',
      header: true
    }

    locationService.getLocationsByLevel('2')
      .then(function (response) {
        vm.states = response
      })
    vm.getZones = function (state) {
      var keys = []
      keys.push(['3', JSON.parse(state)._id])
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.zones = response
        })
    }
    vm.getLgas = function (zone) {
      var keys = []
      keys.push(['4', JSON.parse(zone)._id])
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.lgas = response
        })
    }
    vm.finished = function (data) {
      if (angular.isArray(data)) {
        vm.result = data
      }
    }

    vm.save = function () {
      var locations = []
      var results = vm.csv.result
      for (var i; i < results.length; i++) {
        if (results[i].name) {
          var l = {
            name: results[i].name,
            _id: results[i].id,
            osmId: results[i].osmId,
            'ISO3166-2': results[i]['ISO3166-2'],

            doc_type: 'location',
            level: results[i].level
          }
          l.ancestors = [
            results[i].admin_level_0,
            results[i].admin_level_1,
            results[i].admin_level_2,
            JSON.parse(vm.zone)._id,
            JSON.parse(vm.lga)._id
          ].filter(function (item) {
            return (typeof item === 'string')
          })

          if (l.ancestors.length === 4) {
            l._id = ([
              results[i].admin_level_0,
              results[i].admin_level_1,
              results[i].admin_level_2,
              (JSON.parse(vm.zone).name.replace(' ', '_').toUpperCase()),
              (JSON.parse(vm.lga).name.replace(' ', '_').toUpperCase()),
              l.name.replace(' ', '_').toUpperCase()
            ].join('-'))

            locations.push(l)
          } else {
            results[i].error = true
            vm.invalidUploads = true
          }
        } else {
          return log.error('InvalidFileImport', {})
        }
      }
      return locationService.saveMany(locations)
        .then(function (response) {
          log.success('locationSaveSuccess', response)
          return response
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
        })
    }
  })
