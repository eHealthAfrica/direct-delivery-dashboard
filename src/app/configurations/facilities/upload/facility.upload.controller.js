angular.module('configurations.facilities')
  .controller('FacilityUploadCtrl', function (log, locationService, utility, $scope) {
    var vm = this
    vm.csv = {
      header: true,
      separator: ','
    }
    $scope.csv = vm.csv
    vm.dataToSave = []
    vm.getStates = function () {
      locationService.getLocationsByLevel('2')
        .then(function (response) {
          vm.states = response
          return response
        })
    }

    function getAncestors () {
      var keys = [
        ['5', vm.state]
      ]

      function ancestorNamestoString (facilityAncestors) {
        var nameString = []
        facilityAncestors.forEach(function (row) {
          var splitToArray = row.split('-')
          nameString.push(splitToArray[splitToArray.length - 1])
        })
        return nameString.join('-')
      }

      function extractAncestorName (ancestors, level) {
        var index = ancestors[level]
        var toArray = index.split('-')
        var ancestorName = toArray[toArray.length - 1]
        return ancestorName
      }

      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.invalidUploads = false
          vm.dataToSave = []

          if (vm.csv.result && vm.csv.result.length) {
            vm.csv.result.forEach(function (facility) {
              facility.error = false
              facility.ancestors = []
              for (var r = 0; r < response.length; r++) {
                var level4Ancestor = extractAncestorName(response[r].ancestors, '4').toLowerCase()
                if (utility.replaceAll(facility.lganame, ' ', '-').toLowerCase() === utility.replaceAll(level4Ancestor, '_', '-').toLowerCase()) {
                  if ((utility.replaceAll(facility.wardname.trim(), ' ', '-').toLowerCase() === utility.replaceAll(response[r].name.trim(), ' ', '-').toLowerCase()) && response[r].ancestors.length === 5) {
                    facility.ancestors = response[r].ancestors.slice()
                    facility.ancestors.push(response[r]._id)
                  }
                }
              }

              if (!facility.primary_name) {
                return log.error('InvalidFileImport', {})
              }

              var f = {
                ancestors: facility.ancestors,
                osmId: facility.id,
                ownership: facility.ownership,
                latitude: facility.latitude,
                longitude: facility.longitude,
                category: facility.category,
                name: facility.primary_name,
                level: '6',
                first_contact_name: '',
                first_contact_phone: '',
                first_contact_email: '',
                second_contact_name: '',
                second_contact_phone: '',
                second_contact_email: '',
                doc_type: 'location',
                _id: ([ancestorNamestoString(facility.ancestors), utility.replaceAll(facility.primary_name, ' ', '_')].join('-')).toUpperCase()
              }

              if (f.ancestors.length > 0) {
                vm.dataToSave.push(f)
              } else {
                vm.invalidUploads = true
                facility.error = true
              }
            }
            )
            vm.csv.result.sort(function (a, b) {
              return a.error - b.error
            })
          }
        })
    }

    vm.save = function () {
      return locationService.saveMany(vm.dataToSave)
        .then(function (response) {
          log.success('locationSaveSuccess', response)
          return response
        })
        .catch(function (err) {
          log.error('locationSaveErr', err)
        })
    }

    vm.canSaveData = function () {
      return vm.dataToSave.length
    }

    var warningFired = false
    vm.finished = function (data) {
      if (angular.isArray(data)) {
        if (data.length > 0 || (vm.csv.header && data.length === 1)) { // empty files or files with only headers
          if (!warningFired) {
            getAncestors()
            warningFired = true
          }
        } else {
          if (!warningFired) {
            log.warning('emptyDataUpload', data)
            warningFired = true
          }
        }
      }
    }
    vm.getStates()
  })
