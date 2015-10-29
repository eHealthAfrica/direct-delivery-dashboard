'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsZonesCtrl', function (locationService, log) {
    var vm = this
    vm.states = []
    vm.csv = {
      separator: ',',
      header: true
    }
    vm.canSave = false

    locationService.getLocationsByLevel('2')
      .then(function (response) {
        vm.states = response
      })

    vm.finished = function (data) {
      if (data) {
        vm.canSave = true
      }
    }

    vm.save = function () {
      var locations = []
      var results = vm.csv.result
      for (var i in results) {
        if (results[i].name) {
          var location = {
            name: results[i].name,
            _id: results[i].id,
            osmId: results[i].osmId,
            'ISO3166-2': results[i]['ISO3166-2'],
            ancestors: [
              results[i].admin_level_0,
              results[i].admin_level_1,
              results[i].admin_level_2,
              results[i].admin_level_3,
              results[i].admin_level_4
            ],
            doc_type: 'location',
            level: results[i].level
          }
          locations.push(location)
        } else {
          return log.error('InvalidFileImport', {})
        }
        return locationService.saveMany(locations)
          .then(function (response) {
            console.log(response)
            vm.canSave = false
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  })
