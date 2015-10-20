'use strict'

angular.module('products')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configurations.products', {
        parent: 'configurations.layout',
        url: '/products',
        templateUrl: 'app/configurations/products/product.html',
        controller: 'ProductsCtrl',
        controllerAs: 'productsCtrl',
        resolve: {
          products: function (productService) {
            return productService.getAll()
              .catch(function () {
                return []
              })
          }
        }
      })
      .state('configurations.products.presentation', {
        parent: 'configurations.layout',
        url: '/products/presentation',
        templateUrl: 'app/configurations/products/presentations/presentation.html',
        controller: 'ProductPresentationCtrl',
        controllerAs: 'productPresentationCtrl',
        resolve: {
          presentations: function ($stateParams, productPresentationService, log) {
            return productPresentationService.getAll()
              .catch(function () {
                return []
              })
          },
          baseUOMs: function (productService) {
            return productService.baseUOMs
          }
        }
      })
  })
