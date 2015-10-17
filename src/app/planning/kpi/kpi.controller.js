'use strict'

angular.module('planning').controller('KPIController', function (deliveryRound, kpiTemplates, kpiInfo, kpiService, log) {
  var vm = this
  vm.deliveryRound = deliveryRound
  vm.kpiTemplates = kpiTemplates
  vm.antigens = kpiInfo.antigens
  vm.facilityKPIList = kpiInfo.kpiList

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
      .then(function () {
        return log.success('saveKPISuccess')
      })
      .catch(vm.onSaveError)
  }
})
