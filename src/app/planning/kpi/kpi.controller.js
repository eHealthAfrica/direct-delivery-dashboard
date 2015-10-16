'use strict'

angular.module('planning').controller('KPIController', function (deliveryRound, kpiTemplates, kpiInfo) {
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

  vm.saveRow = function () {
    // TODO: complete implementation
  }
	})
