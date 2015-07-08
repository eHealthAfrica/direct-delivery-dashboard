/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.products', {
        parent: 'configurations.layout',
        url: '/products',
        templateUrl: 'app/configurations/products/product.html',
        controller: 'ProductsController',
        controllerAs: 'productsController',
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