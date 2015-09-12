'use strict';

angular.module('products')
  .controller('ProductPresentationCtrl', function(productPresentationService, presentations){

    var vm = this;

    vm.presentations = presentations;

  });