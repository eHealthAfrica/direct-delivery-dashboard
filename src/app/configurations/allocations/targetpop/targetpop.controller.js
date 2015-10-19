'use strict'

angular.module('allocations')
  .controller('TargetPopulationsController', function (locations, locationService, calculationService, $modal, log, targetPopulationService) {
    var vm = this

    vm.locationStates = ['KN', 'BA']
    vm.selectedState = 'KN'
    vm.selectedLga = ''
    vm.lgas = []
    vm.wards = []
    vm.csv = {
      content: '',
      header: '',
      separator: '',
      result: ''
    }

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
          log.error('', err, 'could not fetch lga list, please try again. contact admin if this persists.')
        })
    }
    function getFacilities (lgs) {
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
        .catch(function () {
          log.error('', '', 'could not retrieve facilities, please reload and try again')
        })
    }
    vm.switchLocationState = function (stateID) {
      var state = stateID || vm.selectedState
      return findLga(state)
        .then(getFacilities)
        .catch(function (err) {
          log.error('', err, 'switching LGA failed')
          return []
        })
    }

    vm.stateList = locations.filter(function (location) {
      return location.level === '2'
    })

    findLga(vm.selectedState)
      .then(getFacilities)
      .then(calculationService.getTargetPop)
      .then(function (response) {
        vm.renderedData = response
        return response
      })

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
    vm.csvHeader = ['_id', 'state', 'facility_id', 'facility_name', 'year', 'annualU1', 'bi-weeklyU1', 'annualWCBA', 'bi-weeklyWCBA']
    vm.csvTemplateDownload = function () {
      var csvArr = []

      if (vm.renderedData.length === 0) {
        return log.error('', '', 'could not retrieve data please try again')
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
  })
