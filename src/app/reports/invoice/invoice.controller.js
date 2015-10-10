'use strict'

angular.module('reports')
  .controller('ReportsAllCtrl', function (deliveryRounds) {
    var vm = this
    vm.deliveryRounds = deliveryRounds
  })
