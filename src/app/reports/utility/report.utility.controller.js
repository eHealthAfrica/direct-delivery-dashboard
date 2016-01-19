'use strict'

angular.module('reports')
  .controller('ReportUtilityCtrl', function ($q, $window, deliveryService, kpiService, rounds, deliveryRoundService, $scope) {
    var vm = this
    var rnd = []
    var kpiData = {}
    var productData = {}
    var totalImmunized = 0

    var roundsPerChart = 5
    vm.currentPage = 1

    vm.rounds = rounds.sort(function (a, b) {
      return a.endDate < b.endDate
    })
    vm.utilData = []
    vm.chartData = []
    vm.isLoading = true

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

    function paginateRounds (page) {
      var needleStart = (page - 1) * roundsPerChart
      var needleEnd = needleStart + roundsPerChart

      var pageRounds = []
      for (var i = needleStart; i < needleEnd; i++) {
        if (angular.isDefined(vm.rounds[i])) {
          pageRounds.push(vm.rounds[i])
        }
      }
      console.info(pageRounds)
      return pageRounds
    }
    vm.nextPage = function nextPage () {
      vm.currentPage += 1
      return prepareData()
    }

    vm.prevPage = function prevPage () {
      vm.currentPage -= 1
      return prepareData()
    }
    function pushProducts (response) {
      var rnd, packed
      for (var i in response) {
        productData[response[i].deliveryRoundID] = angular.isObject(productData[response[i].deliveryRoundID]) ? productData[response[i].deliveryRoundID] : {}
        rnd = productData[response[i].deliveryRoundID]
        for (var pp in response[i].packingList) {
          packed = response[i].packingList[pp]
          rnd[packed.productID] = (angular.isNumber(rnd[packed.productID]) ? rnd[packed.productID] : 0) + (packed['packedQty'] || 0)
        }
      }
      return response[0]['deliveryRoundID']
    }

    function pushKpi (response) {
      var akpi
      var rnd
      if (angular.isArray(response.kpiList)) {
        if (response.kpiList.length > 0) {
          for (var k in response.kpiList) {
            rnd = response.kpiList[k].deliveryRoundID
            kpiData[rnd] = angular.isNumber(kpiData[rnd]) ? kpiData[rnd] : 0
            for (var a in response.kpiList[k].antigensKPI) {
              akpi = response.kpiList[k].antigensKPI[a]
              kpiData[rnd] += angular.isNumber(akpi.noImmunized) ? akpi.noImmunized : 0
              totalImmunized += angular.isNumber(akpi.noImmunized) ? akpi.noImmunized : 0
            }
          }
        }
      }
    }

    function prepareData () {
      paginateRounds(vm.currentPage).forEach(function (r) {
        rnd.push(
          deliveryService.getByRoundId(r)
            .then(function (data) {
              return pushProducts(data)
            })
            .then(function (data) {
              return kpiService.getByRoundId(data)
            })
            .then(pushKpi)
            .catch(function errHandler (err) {
              console.log(err)
            })
        )
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
          vm.kpiValues = angular.copy(tempObj.kpi.values)
          vm.kpiValues.sort(function (a, b) {
            return a[1] < b[1]
          })
          if (vm.chartData.length > 0) {
            vm.isLoading = false
          }
        }).catch(function (data) {})
    }

    $scope.$on('stateChanged', function (data) {
      deliveryRoundService.getByStateCode().then(function (data) {
        vm.rounds = data
        prepareData()
      })
    })
    prepareData()
  })
