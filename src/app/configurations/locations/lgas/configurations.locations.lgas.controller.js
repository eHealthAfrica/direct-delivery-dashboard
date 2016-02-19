'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsLgasCtrl', function (locationService, log, utility) {
    var vm = this
    vm.states = []
    vm.zones = []
    vm.result = []
    vm.csv = {
      separator: ',',
      header: true
    }
    vm.canSave = false

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
    vm.finished = function (data) {
      if (angular.isArray(data)) {
        vm.result = data
      }
    }

    vm.save = function () {
      var locations = []
      var results = vm.csv.result
      for (var i = 0; i < results.length; i++) {
        if (results[i].name) {
          var l = {
            name: results[i].name,
            _id: results[i].id,
            osmId: results[i].osmId,
            'ISO3166-2': results[i]['ISO3166-2'],
            ancestors: [
              results[i].admin_level_0,
              results[i].admin_level_1,
              results[i].admin_level_2,
              JSON.parse(vm.zone)._id
            ],
            doc_type: 'location',
            level: results[i].level
          }
          l._id = (l.ancestors.join('-') + '-' + utility.replaceAll(l.name, ' ', '_')).toUpperCase()
          locations.push(l)
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
