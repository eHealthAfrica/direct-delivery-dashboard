'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsCtrl', function (locationService) {
    var vm = this

    vm.csv = {
      header: true,
      separator: ','
    }

    vm.finished = function (data) {
      if (data) {
        vm.result = data
        console.log(vm.result)
      }
    }

    vm.save = function () {
      console.log('saving...')
      var locations = []
      var results = vm.csv.result
      for (var i in results) {
        locations.push({
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
        })
      }

      return locationService.saveMany(locations)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  })
