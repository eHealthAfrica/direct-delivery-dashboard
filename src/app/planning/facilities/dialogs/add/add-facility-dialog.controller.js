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
    vm.selectionOpions = ['All', 'None']
    vm.selectedIds = {}

    function fromLevel (locLevel) {
      return locLevel.level >= vm.START_LEVEL && locLevel.level <= vm.END_LEVEL
    }

    // TODO: move to reusable utility function e.g sortBy(field, asc | desc)
    function sortBy (a, b) {
      return a.level > b.level
    }

    vm.selectedLocLevel = vm.locationLevels.filter(fromLevel).sort(sortBy)

    vm.isSelected = function (id) {
      return vm.selectedIds[id] === true
    }

    function selectAll (locations) {
      locations
        .forEach(function (loc) {
          vm.selectedIds[loc._id] = true
        })
    }

    vm.onSelection = function (level) {
      if (!level) {
        return
      }
      vm.selectedlevelLocs = []
      locationService.getLocationsByLevel(level)
        .then(function (locations) {
          vm.selectedlevelLocs = locations
          selectAll(vm.selectedlevelLocs)
        })
    }

    vm.onChecked = function (index) {
      vm.selectedlevelLocs[index].selected = !vm.selectedlevelLocs[index].selected
    }

    vm.onSelectionOptions = function (selected) {
      if (selected === vm.selectionOpions[0]) {
        selectAll(vm.selectedlevelLocs, true)
      } else if (selected === vm.selectionOpions[1]) {
        vm.selectedIds = {}
      }
    }

    function getQueryKey (level, selectedIds) {
      var keys = []
      for (var k in selectedIds) {
        var selected = selectedIds[k]
        if (selected === true) {
          var queryKey = [level, k]
          keys.push(queryKey)
        }
      }
      return keys
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
      if (utility.isEmptyObject(vm.selectedIds)) {
        return log.error('selectLevelToImportFromErr')
      }

      var lastLevel = vm.locationLevels[vm.locationLevels.length - 1]
      var queryKeys = getQueryKey(lastLevel._id, vm.selectedIds)
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
