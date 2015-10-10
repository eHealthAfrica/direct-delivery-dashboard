'use strict'

angular.module('products')
  .controller('ProductPresentationCtrl', function (productPresentationService, presentations, baseUOMs, log) {
    var vm = this

    vm.presentations = presentations
    vm.baseUOMs = baseUOMs
    vm.openedDoc = {}
    console.log(presentations)
    vm.save = function () {
      console.log(vm.openedDoc)
      return productPresentationService.save(vm.openedDoc)
        .then(function (response) {
          vm.presentations.push(angular.extend({}, vm.openedDoc, response))
          vm.openedDoc = {}
          return log.success('', '', 'presentation saved successfully')
        })
        .catch(function () {
          return log.error('', '', 'failed to save presentation!')
        })
    }
  })
