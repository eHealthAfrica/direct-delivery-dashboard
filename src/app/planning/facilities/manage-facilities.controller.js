'use strict'

angular.module('planning')
  .controller('ManageFacilitiesCtrl', function (
    $state,
    $modal,
    deliveryRound,
    addFacilityService,
    mailerService,
    copyRoundService,
    scheduleService,
    log,
    locationLevels,
    config,
    utility,
    authService
  ) {
    var vm = this

    vm.deliveryRound = deliveryRound
    vm.facilityList = []
    vm.selectedList = {}
    vm.selectOptions = [ 'All', 'None' ]
    vm.roundTemplate = []
    vm.locationLevels = locationLevels

    vm.disableSave = function () {
      return angular.isObject(vm.selectedList) && Object.keys(vm.selectedList).length === 0
    }

    vm.onSelect = function (option) {
      var none = vm.selectOptions[1]
      if (option === none) {
        vm.selectedList = {}
        return
      }
      vm.facilityList.forEach(function (facility) {
        vm.selectedList[facility.id] = true
      })
    }

    vm.onSelection = function (roundTemplate) {
      vm.facilityList = []
      vm.roundTemplate = roundTemplate
      vm.roundTemplate.forEach(function (facilityRound) {
        vm.facilityList.push(facilityRound.facility)
        vm.selectedList[facilityRound.facility.id] = true
      })
    }

    vm.onAddFacility = function (facilityList) {
      facilityList.forEach(function (facility) {
        var temp = {
          name: facility.name,
          id: facility._id,
          ward: facility.ancestors[5].name,
          lga: facility.ancestors[4].name,
          zone: facility.ancestors[3].name
        }
        vm.facilityList.push(temp)
        vm.selectedList[temp.id] = true
      })
    }

    vm.openAddFacilitiesDialog = function () {
      var addFacilitiesDialog = $modal.open({
        animation: true,
        templateUrl: 'app/planning/facilities/dialogs/add/add-facility-dialog.html',
        controller: 'AddFacilityDialogCtrl',
        controllerAs: 'afdCtrl',
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          locationLevels: function () {
            return vm.locationLevels
          },
          deliveryRound: function () {
            return vm.deliveryRound
          },
          selectedStateID: authService.getUserSelectedState.bind(null, true)
        }
      })

      addFacilitiesDialog.result
        .then(vm.onAddFacility)
    }

    vm.copyFromRoundDialog = function () {
      var copyRoundDialog = $modal.open({
        animation: true,
        templateUrl: 'app/planning/facilities/dialogs/copy-round/copy-round.html',
        controller: 'CopyRoundTemplateDialogCtrl',
        controllerAs: 'crtdCtrl',
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          deliveryRounds: function (planningService) {
            function filterCurrentRound (rounds) {
              function isntCurrentRound (round) {
                return round._id !== deliveryRound._id
              }
              return rounds.filter(isntCurrentRound)
            }

            return planningService.all()
              .then(filterCurrentRound)
              .catch(utility.returnEmptyList)
          },
          deliveryRound: function () {
            return vm.deliveryRound
          }
        }
      })

      copyRoundDialog.result
        .then(vm.onSelection)
    }

    function OnError (err) {
      scheduleService.onSaveError(err)
    }

    function onSuccess (res) {
      log.success('schedulesSaved')
      var stateParams = { roundId: vm.deliveryRound._id }
      $state.go('planning.schedule', stateParams)
    }

    vm.save = function () {
      var roundSchedules = copyRoundService.copySchedules(vm.roundTemplate, vm.selectedList)
      var roundId = vm.deliveryRound._id
      var newFacilitySchedules = addFacilityService.prepareSchedules(vm.facilityList, vm.selectedList, roundId)
      var deliveryRoundSchedules = roundSchedules.concat(newFacilitySchedules)
      scheduleService.saveSchedules(deliveryRoundSchedules)
        .then(onSuccess)
        .catch(OnError)
    }
  })
