'use strict'

angular.module('reports')
  .controller('ReportUtilityCtrl', function ($scope, $q, deliveryService, kpiService, rounds) {
    var vm = this
    var rnd = []
    vm.rounds = rounds
    vm.utilData = []
    vm.chartData = []

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
      return function (d) {
        return vm.rounds[d]
      }
    }

    var kpiData = {}
    var productData = {}
    function pushProducts (response) {
      var rnd, packed
      for (var i in response) {
        productData[response[i].deliveryRoundID] = angular.isObject(productData[response[i].deliveryRoundID]) ? productData[response[i].deliveryRoundID] : {}
        rnd = productData[response[i].deliveryRoundID]
        for (var pp in response[i].packedProduct) {
          packed = response[i].packedProduct[pp]
          rnd[packed.productID] = (angular.isNumber(rnd[packed.productID]) ? rnd[packed.productID] : 0) + packed.expectedQty
        }
      }
    }

    function pushkpi (response) {
      var akpi
      var rnd
      if (angular.isArray(response.kpiList)) {
        if (response.kpiList.length > 0) {
          for (var k in response.kpiList) {
            rnd = response.kpiList[k].deliveryRoundID
            kpiData[rnd] = angular.isNumber(kpiData[rnd]) ? kpiData[rnd] : 0
            for (var a in response.kpiList[k].antigensKPI) {
              akpi = response.kpiList[k].antigensKPI[a]
              kpiData[rnd] += akpi.noImmunized
            }
          }
        }
      }
    }
    function errHandler (err) {
      console.error(err)
    }

    rnd.push(deliveryService.getByRoundId(vm.rounds).then(pushProducts).catch(errHandler))
    rnd.push(kpiService.getByRoundId(vm.rounds).then(pushkpi).catch(errHandler))
    $q.all(rnd)
      .then(function (response) {
        var tempObj = {
          kpi: {
            key: 'noImmunized',
            values: []
          }
        }

        for (var r in vm.rounds) {
          if (kpiData[vm.rounds[r]]) {
            tempObj.kpi.values.push([parseInt(r, 10), kpiData[vm.rounds[r]]])
          }
          if (productData[vm.rounds[r]]) {
            for (var p in productData[vm.rounds[r]]) {
              tempObj[p] = angular.isObject(tempObj[p]) ? tempObj[p] : {
                key: p,
                values: []
              }
              tempObj[p].values.push([parseInt(r, 10), productData[vm.rounds[r]][p]])
            }
          }
        }
        for (var co in tempObj) {
          vm.chartData.push(tempObj[co])
        }
      })
  })
