/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .controller('ProductsCtrl', function(products){
    var vm = this;

    vm.products = angular.isArray(products) ? products : [];
  });