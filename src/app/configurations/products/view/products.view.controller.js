'use strict';

angular.module('products')
  .controller('ProductViewCtrl', function(product){

    var vm = this;

    vm.product = product;
  });