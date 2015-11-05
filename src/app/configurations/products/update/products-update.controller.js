'use strict'

angular.module('products')
  .controller('ProductUpdateCtrl', function (product, storageTypes, log, $state, productService, baseUOMs) {
    var vm = this

    vm.product = {}
    vm.storageTypes = storageTypes
    vm.baseUOMs = baseUOMs

    if (product) {
      vm.product = product
      vm.productCode = product.code
    }

    vm.save = function (valid) {
      if (!vm.product._id) {
        vm.product._id = vm.product.code // new product
      }
      productService.save(vm.product)
        .then(function (response) {
          log.success('productSave', response)
          return $state.go('configurations.products')
        })
        .catch(function (err) {
          return log.error('productSaveErr', err)
        })
    }
  })
