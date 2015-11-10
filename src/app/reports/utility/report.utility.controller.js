'use strict'

angular.module('reports')
  .controller('ReportUtilityCtrl', function ($q, deliveryService, kpiService, rounds) {
    var vm = this
    vm.rounds = rounds
    vm.utilData = []

    vm.utilx = function () {
      return function (d) {
        return d[0]
      }
    }
    vm.utily = function () {
      return function (d) {
        return d[1]
      }
    }

    vm.xtick = function () {
      var roundList = {
        '7': 'KN-007-2015',
        '8': 'KN-008-2015',
        '9': 'KN-009-2015'
      }
      return function (d) {
        return roundList[d]
      }
    }

    vm.utilData = [
      {
        'key': 'Immunised',
        'values': [[7, 70], [8, 79], [9, 70]]
      },
      {
        'key': 'BCG',
        'values': [[7, 350], [8, 400], [9, 350]]
      },
      {
        'key': 'TT',
        'values': [[7, 500], [8, 500], [9, 560]]
      },
      {
        'key': 'OPV',
        'values': [[7, 1500], [8, 1560], [9, 1300]]
      }
    ]
    var kpiColate = {}
    var productColate = {}
    function pushProducts (response) {
      var rnd, packed
      for (var i in response) {
        productColate[response[i].deliveryRoundID] = angular.isObject(productColate[response[i].deliveryRoundID]) ? productColate[response[i].deliveryRoundID] : {}
        rnd = productColate[response[i].deliveryRoundID]
        for (var pp in response[i].packedProduct) {
          packed = response[i].packedProduct[pp]
          rnd[packed.productID] = (angular.isNumber(rnd[packed.productID]) ? rnd[packed.productID] : 0) + packed.expectedQty
        }
      }
    }

    function pushkpi (response) {
      console.log(response)
      var akpi
      var rnd
      if (angular.isArray(response.kpiList)) {
        if (response.kpiList.length > 0) {
          for (var k in response.kpiList) {
            rnd = response.kpiList[k].deliveryRoundID
            kpiColate[rnd] = angular.isNumber(kpiColate[rnd]) ? kpiColate[rnd] : 0
            for (var a in response.kpiList[k].antigensKPI) {
              akpi = response.kpiList[k].antigensKPI[a]
              kpiColate[rnd] += akpi.noImmunized
            }
          }
        }
      }
    }
    function errHandler (err) {
      console.error(err)
    }

    for (var r in vm.rounds) {
      var rnd = {
        products: {},
        kpi: {}
      }
      rnd.products[vm.rounds[r]] = deliveryService.getByRoundId(vm.rounds).then(pushProducts).catch(errHandler)
      rnd.kpi[vm.rounds[r]] = kpiService.getByRoundId(vm.rounds).then(pushkpi).catch(errHandler)
    }
    console.log(productColate)
    console.log(kpiColate)
  })
