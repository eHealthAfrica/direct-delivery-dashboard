'use strict'

angular.module('configurations.locations')
  .controller('ConfigurationsLocationsCtrl', function (log, locationService) {
    var vm = this
    vm.result = []
    vm.csv = {
      header: true,
      separator: ','
    }
    var warningFired = false
    vm.finished = function (data) {
      if (angular.isArray(data)) {
        if (data.length > 0 || (vm.csv.header && data.length === 1)) { // empty files or files with only headers
          vm.result = data
          warningFired = false
        } else {
          if (!warningFired) {
            log.warning('emptyDataUpload', data)
            warningFired = true
          }
        }
      }
    }

    vm.save = function () {
      var locations = []
      var results = vm.csv.result

      for (var i in results) {
        if (results[i].name) {
          locations.push({
            name: results[i].name,
            _id: results[i].id,
            osmId: results[i].osmId,
            'ISO3166-2': results[i]['ISO3166-2'],
            ancestors: [
              (results[i].admin_level_0.length > 1) ? results[i].admin_level_0: null,
              (results[i].admin_level_1.length > 1) ? results[i].admin_level_1: null
            ],
            doc_type: 'location',
            level: results[i].level || '2'
          })
        }
      }
      console.log(locations)
      return
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
