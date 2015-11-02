'use strict'

angular.module('products')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configurations.products.edit', {
        url: '/products/edit/:code',
        parent: 'configurations.layout',
        templateUrl: 'app/configurations/products/update/update.html',
        controller: 'ProductUpdateCtrl',
        controllerAs: 'productUpdateCtrl',
        resolve: {
          product: function ($stateParams, productService, log) {
            return productService.get($stateParams['code'])
              .catch(function (err) {
                if (err.status === '404') {
                  return null
                } else {
                  return log.error('productRetrievalErr', err)
                }
              })
          },
          storageTypes: function (productService, log) {
            return productService.getProductStorageType()
              .catch(function (error) {
                log.error('productStorageFetchErr', error)
                return []
              })
          },
          baseUOMs: function (productService) {
            return productService.baseUOMs
          }
        }
      })
      .state('configurations.products.add', {
        url: '/products/add',
        parent: 'configurations.layout',
        templateUrl: 'app/configurations/products/update/update.html',
        controller: 'ProductUpdateCtrl',
        controllerAs: 'productUpdateCtrl',
        resolve: {
          product: function () {
            return {doc_type: 'product'}
          },
          storageTypes: function (productService, log) {
            return productService.getProductStorageType()
              .catch(function (error) {
                log.error('productStorageFetchErr', error)
                return []
              })
          },
          baseUOMs: function (productService) {
            return productService.baseUOMs
          }
        }
      })
  })
