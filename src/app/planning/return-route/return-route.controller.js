'use strict'

angular.module('planning')
  .controller('ReturnRouteCtrl', function (deliveryRound, packingStores,
    deliveryReturnRoutes, utility,
    returnRouteService, log, scheduleService) {
    var vm = this

    vm.query = ''
    vm.deliveryRound = deliveryRound
    vm.deliveryReturnRoutes = deliveryReturnRoutes
    vm.packingStores = packingStores
    vm.facilitiesScheduled = {}
    vm.deliveryReturnRoutes.forEach(function (row) {
      scheduleService.getDriverLastDrop(row.driverID, row.deliveryDate)
        .then(function (response) {
          vm.facilitiesScheduled[row._id] = []
          console.log(row.lastDropFacility)
          for (var i in response[1]) {
            vm.facilitiesScheduled[row._id].push(response[1][i].facility)
            if (!angular.isDefined(row.lastDropFacility)) {
              row.lastDropFacility = response[1][i].facility
            }
          }
          return vm.facilitiesScheduled
        })
    })
    vm.getDocBy = function (driverId, deliveryDate) {
      return utility.takeFirst(vm.deliveryReturnRoutes
        .filter(function (row) {
          return (row.driverID === driverId && row.deliveryDate === deliveryDate)
        }))
    }

    vm.isEmptyReturnRoutes = function () {
      return vm.deliveryReturnRoutes.length === 0
    }

    vm.saveRow = function ($data, driverId, deliveryDate) {
      var doc = vm.getDocBy(driverId, deliveryDate)
      if (doc) {
        for (var k in $data) {
          var value = $data[k]
          if (value) {
            doc[k] = value
          }
        }
        return returnRouteService.save(doc)
          .then(function (res) {
            doc = res
            log.success('returnRouteSaved')
          })
          .catch(returnRouteService.onSaveError)
      }
    }
  })
