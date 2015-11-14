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

    function _getAncestors () {
      var keys = [
        ['3', vm.state],
        ['4', vm.state],
        ['5', vm.state]
      ]
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          var zone
          var lga
          var ward
          var _id
          vm.invalidUploads = false
          vm.dataToSave = []

          var state = vm.states.filter(function (st) {
            return st._id === vm.state
          })[0]

          if (vm.csv.result && vm.csv.result.length) {
            vm.csv.result.forEach(function (facility) {
              facility.error = false
              facility.ancestors = [].concat(state.ancestors)
              facility.ancestors.push(vm.state)
              _id = facility.ancestors.join('-')

              for (var r in response) {
                if ((utility.replaceAll(facility.zone, ' ', '-').toUpperCase() === utility.replaceAll(response[r].name, ' ', '-').toUpperCase()) && response[r].level === '3') {
                  facility.ancestors.push(response[r]._id)
                  zone = utility.replaceAll(response[r].name, ' ', '_')
                }
                if ((utility.replaceAll(facility.lganame, ' ', '-') === utility.replaceAll(response[r].name, ' ', '-')) && response[r].level === '4') {
                  facility.ancestors.push(response[r]._id)
                  lga = utility.replaceAll(response[r].name, ' ', '_')
                }
                if ((utility.replaceAll(facility.wardname, ' ', '-') === utility.replaceAll(response[r].name, ' ', '-')) && response[r].level === '5') {
                  facility.ancestors.push(response[r]._id)
                  ward = utility.replaceAll(response[r].name, ' ', '_')
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
                _id: (_id + '-' + [zone, lga, ward, utility.replaceAll(facility.primary_name, ' ', '_')].join('-')).toUpperCase()
              }
              if (f.ancestors.length === 6) {
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

    function getAncestors () {
      _getAncestors()
        .then(function () {
          return
        })
    }

    vm.changeState = function () {
      if (vm.state) {
        getAncestors()
      }
    }

    $scope.$watch('csv.result', function (newVal, oldVal) {
      if (!newVal || !newVal.length) {
        return
      }
      getAncestors()
    })
    vm.getStates()
  })
