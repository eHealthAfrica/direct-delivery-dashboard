/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .controller('ProductsController', function(products){
    var vm = this;

    vm.products = products;
  });