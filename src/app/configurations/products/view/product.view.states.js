'use strict';

angular.module('products')
  .config(function($stateProvider){
    $stateProvider
      .state('configurations.products.layout', {
        abstract: true,
        parent: 'configurations.layout',
        templateUrl: 'app/configurations/products/layout.html'
      })
      .state('configurations.products.view', {
        url: '/products/view/:code',
        parent: 'configurations.products.layout',
        views: {
          productProfile: {
            templateUrl: 'app/configurations/products/view/view.html',
            controller: 'ProductViewCtrl',
            controllerAs: 'productViewCtrl',
            resolve: {
              product: function ($stateParams, productService, log) {
                return productService.get($stateParams['code'])
                  .catch(function (err) {
                    if (err.status === '404') {
                      return null;
                    } else {
                      return log.error('productRetrievalErr', err);
                    }
                  })
              }
            }
          },
          productPresentation: {
            templateUrl: 'app/configurations/products/presentations/presentation.html'
          }
        }

      })
  });