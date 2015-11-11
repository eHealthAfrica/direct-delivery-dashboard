'use strict'

angular.module('reports')
  .controller('ReportUtilityCtrl', function ($q, $window, deliveryService, kpiService, rounds) {
    var vm = this
    var rnd = []
    var kpiData = {}
    var productData = {}
    var totalImmunized = 0

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
              totalImmunized += akpi.noImmunized
            }
          }
        }
      }
    }
    function errHandler (err) {
      console.error(err)
    }
    vm.rounds.forEach(function(r){
      rnd.push(kpiService.getByRoundId(r).then(pushkpi).catch(errHandler))
      rnd.push(deliveryService.getByRoundId(r).then(pushProducts).catch(errHandler))
    })


    $q.all(rnd)
      .then(function (response) {
        var tempObj = {
          kpi: {
            key: 'Immunized',
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
        vm.kpiAgg = {
          total: totalImmunized,
          ave: $window.Math.floor(totalImmunized / vm.rounds.length)
        }
        vm.kpiValues =  angular.copy(tempObj.kpi.values);
        vm.kpiValues.sort(function(a, b){
          return a[1] < b[1]
        })
        console.log(vm.kpiValues)
      })
  })