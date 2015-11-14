'use strict'

angular.module('planning')
  .controller('AddFacilityDialogCtrl', function (
    $modalInstance,
    deliveryService,
    deliveryRound,
    locationService,
    locationLevels,
    utility,
    log
  ) {
    var vm = this
    vm.deliveryRound = deliveryRound
    vm.START_LEVEL = 3
    vm.END_LEVEL = 5
    vm.locationLevels = locationLevels
    vm.locations = {}

    function fromLevel (locLevel) {
      return locLevel.level >= vm.START_LEVEL && locLevel.level <= vm.END_LEVEL
    }

    // TODO: move to reusable utility function e.g sortBy(field, asc | desc)
    function sortBy (a, b) {
      return a.level > b.level
    }

    vm.selectedLocLevel = vm.locationLevels.filter(fromLevel).sort(sortBy)

    vm.onSelection = function (level) {
      function pick (locations) {
        function nameAndId (location) {
          return {
            _id: location._id,
            name: location.name
          }
        }
        return locations.map(nameAndId)
      }

      function bind (locations) {
        vm.locations.all = locations
      }

      if (!level) {
        vm.locations = {}
        return
      }

      locationService.getLocationsByLevel(level)
        .then(pick)
        .then(bind)
    }

    vm.selectAllToggle = function (toggle) {
      if (toggle) {
        vm.locations.selected = vm.locations.all
        return
      }
      vm.locations.selected = []
    }

    function getQueryKey (level, selectedLocations) {
      function createKeyTuple (selectedLocation) {
        return [
          level,
          selectedLocation._id
        ]
      }
      return selectedLocations.map(createKeyTuple)
    }

    function getUniqueAncestorList (facilities) {
      var facilityAncestors = {}
      facilities.forEach(function (facility) {
        if (angular.isArray(facility.ancestors)) {
          facility.ancestors
            .forEach(function (ancestorId) {
              facilityAncestors[ancestorId] = true
            })
        }
      })
      return Object.keys(facilityAncestors)
    }

    function collateDocs (facilities, ancestors) {
      function byId (list, id) {
        return list.filter(function (ancestor) {
          return ancestor._id === id
        })
      }
      return facilities.map(function (facility) {
        var ancestorId
        for (var i in facility.ancestors) {
          ancestorId = facility.ancestors[i]
          var matches = byId(ancestors, ancestorId)
          var ancestor = utility.takeFirst(matches)
          facility.ancestors[i] = ancestor
        }
        return facility
      })
    }

    vm.addToList = function () {
      if (!vm.locations.selected.length) {
        return log.error('selectLevelToImportFromErr')
      }

      var lastLevel = vm.locationLevels[vm.locationLevels.length - 1]
      var queryKeys = getQueryKey(lastLevel._id, vm.locations.selected)
      locationService.getByLevelAndAncestor(queryKeys)
        .then(function (facilities) {
          var ancestorsId = getUniqueAncestorList(facilities)
          return locationService.getByIds(ancestorsId)
            .then(function (ancestors) {
              var result = collateDocs(facilities, ancestors)
              if (result.length === 0) {
                return log.info('noFacilityInAdminLevels')
              }
              $modalInstance.close(result)
            })
        })
        .catch(function (err) {
          log.error('fetchByAncestorsFailed', err)
        })
    }
  })
