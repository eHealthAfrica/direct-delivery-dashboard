'use strict'

angular.module('allocations')
  .controller('TargetPopulationsController', function (
    locations,
    locationService,
    calculationService,
    $modal,
    log,
    targetPopulationService,
    states,
    selectedStateId,
    $scope
  ) {
    var vm = this
    vm.selectedLga = ''
    vm.lgas = []
    vm.wards = []
    vm.csv = {
      content: '',
      header: '',
      separator: '',
      result: ''
    }
    vm.selectedState = selectedStateId
    vm.stateList = states
    vm.csvHeader = ['_id', 'state', 'facility_id', 'facility_name', 'year', 'annualU1', 'bi-weeklyU1', 'annualWCBA', 'bi-weeklyWCBA']

    function findLga (state) {
      var keys = []
      keys.push(['4', state])
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          vm.lgas = response
          vm.selectedLga = response[0]
          return vm.selectedLga
        })
        .catch(function (err) {
          log.error('lgaListErr', err)
        })
    }

    function getFacilities () {
      var level = '6'
      var keys = []
      var lgas = vm.selectedLga
      if (!lgas) {
        vm.rederedData = []
        return
      }
      if (angular.isArray(lgas)) {
        for (var i in lgas) {
          keys.push([level, lgas[i]._id])
        }
      } else {
        keys.push([level, lgas._id])
      }
      return locationService.getByLevelAndAncestor(keys)
        .then(function (response) {
          return response
        })
        .catch(function (err) {
          log.error('facilitiesRetrievalErr', err)
        })
    }

    vm.switchLocationState = function (stateID) {
      var state = stateID || vm.selectedState
      return findLga(state)
        .then(getFacilities)
        .then(calculationService.getTargetPop)
        .then(function (response) {
          vm.renderedData = response
        })
        .catch(function (err) {
          log.error('locationSwitchErr', err)
        })
    }

    vm.switchLocationLga = function () {
      getFacilities()
        .then(calculationService.getTargetPop)
        .then(function (response) {
          vm.renderedData = response
        })
        .catch(function (err) {
          log.error('locationSwitchErr', err)
        })
    }

    vm.saveUpdate = function (doc) {
      targetPopulationService.update(doc)
        .then(function (data) {
          vm.editing = ''
          return log.success('targetPopulationEdited', data)
        })
        .catch(function (err) {
          vm.editing = ''
          return log.error('targetPopSave', err)
        })
    }

    vm.csvTemplateDownload = function () {
      var csvArr = []

      if (vm.renderedData.length === 0) {
        return log.error('dataRetrievalErr')
      }
      for (var i in vm.renderedData) {
        csvArr.push({
          '_id': vm.renderedData[i]._id,
          'state': vm.selectedState,
          'facility_id': vm.renderedData[i].facility._id,
          'facility_name': vm.renderedData[i].facility.name,
          'year': vm.renderedData[i].year,
          'annualU1': vm.renderedData[i].annualU1,
          'bi-weeklyU1': vm.renderedData[i]['bi-weeklyU1'],
          'annualWCBA': vm.renderedData[i].annualWCBA,
          'bi-weeklyWCBA': vm.renderedData[i]['bi-weeklyWCBA']
        })
      }
      return csvArr
    }

    vm.csvUpload = function (data) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/configurations/allocations/targetpop/upload/upload-csv-form.html',
        controller: 'TargetPopCSVUploadCtrl',
        controllerAs: 'uploadCSVCtrl',
        size: 'lg',
        resolve: {

        }
      })
      modalInstance.result.then(function (formData) {
        for (var i in vm.renderedData) {
          if (formData[vm.renderedData[i]._id]) {
            angular.extend(vm.renderedData[i], formData[vm.renderedData[i]._id])
          }
        }
        targetPopulationService.saveMany(vm.renderedData)
          .then(function (data) {
            return log.success('targetPopulationEdited', data)
          })
          .catch(function (err) {
            return log.error('targetPopulationEdited', err)
          })
      })
        .catch(function (err) {
          log.info('targetPopSave', err)
        })
    }

    vm.switchLocationState()
    $scope.$on('stateChanged', function (event, data) {
      var state = data.state
      vm.selectedState = state._id
      vm.switchLocationState()
    })
  })
