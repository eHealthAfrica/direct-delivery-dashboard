'sue strict';

angular.module('products')
  .controller('ProductsCtrl', function(products){
    var vm = this;

    vm.products = angular.isArray(products) ? products : [];
  });