'use strict';

angular.module('finance')
  .controller('FinanceAllCtrl', function(financeService, all) {
    var vm = this;
    vm.all = all;
  });
