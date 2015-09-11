'use strict';

angular.module('products')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.products', {
        parent: 'configurations.layout',
        url: '/products',
        templateUrl: 'app/configurations/products/product.html',
        controller: 'ProductsCtrl',
        controllerAs: 'productsCtrl',
        resolve: {
          products : function(productService){
            return productService.getAll()
              .catch(function(err){
                return [];
              });
          }
        }
      })
  });