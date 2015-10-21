'use strict'

angular.module('planning').controller('KPIController', function (deliveryRound, kpiTemplates, kpiInfo, kpiService, log) {
  var vm = this
  vm.deliveryRound = deliveryRound
  vm.kpiTemplates = kpiTemplates

  vm.setKPI = function (kpi) {
    vm.antigens = kpi.antigens
    vm.facilityKPIList = kpi.kpiList
    kpiService.fillInMissingKPI(vm.facilityKPIList, vm.deliveryRound._id, vm.kpiTemplates[0])
      .then(function (kpiList) {
        vm.facilityKPIList = kpiList
      })
      .catch(function (err) {
        log.error('assignKPIFromTemplateErr', err)
      })
  }

  vm.setKPI(kpiInfo)

  vm.getDriver = function (driver) {
    if (angular.isString(driver)) {
      return driver.split('@')[0]
    }
    return ''
  }

  vm.onSaveError = function (err) {
    if (err.status === 401) {
      return log.error('unauthorizedAccess', err)
    }
    if (err.status === 409) {
      return log.error('updateConflict', err)
    }
    return log.error('saveKPIError', err)
  }

  vm.onSuccess = function () {
    return log.success('saveKPISuccess')
  }

  vm.isEmptyFacilityKPI = function () {
    return vm.facilityKPIList.length === 0
  }

  vm.saveAll = function () {
    vm.isSavingAll = true
    return kpiService.saveDocs(vm.facilityKPIList)
      .then(function () {
        return kpiService.getByRoundId(vm.deliveryRound._id)
          .then(vm.setKPI)
          .catch(function (err) {
            log.error('getDeliveryRoundKPIListErr', err)
            return {
              antigens: [],
              kpiList: []
            }
          })
      })
      .catch(vm.onSaveError)
      .finally(function () {
        vm.isSavingAll = false
      })
  }

  vm.saveRow = function ($data, kpiList, $index) {
    var facKPI = kpiList[$index]
    var tempDoc = angular.copy(facKPI)
    tempDoc.antigensKPI = tempDoc.antigensKPI
      .map(function (antigenKPI) {
        var update = $data[antigenKPI.productID]
        if (antigenKPI && angular.isNumber(update) && angular.isNumber(antigenKPI.noImmunized)) {
          antigenKPI.noImmunized = update
        }
        return antigenKPI
      })
    tempDoc.outreachSessions = $data.outreachSessions
    tempDoc.notes = $data.notes
    return kpiService.save(tempDoc)
      .then(vm.onSuccess)
      .catch(vm.onSaveError)
  }
})
