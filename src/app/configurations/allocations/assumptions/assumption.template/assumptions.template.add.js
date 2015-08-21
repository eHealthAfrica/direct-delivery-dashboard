/**
 * Created by ehealthafrica on 7/27/15.
 */

angular.module('allocations')
  .controller('AssumptionsTemplateAddCtrl', function($scope, data, products,  $modalInstance){

    var vm = this;
    vm.template = {
      name: '',
      description: '',
      primary: {
        state: '',
        year: ''
      },
      products: {},
      doc_type: 'allocation_template'
    };

    vm.productList = products;
    vm.dragging = false;



    if(data){
      vm.template = data;

    }

    vm.updateTemplateProducts = function(product){
      vm.template.products[product.code] = product;
    };
    vm.close = function(){
      $modalInstance.close(vm.template);
    };
    vm.cancel = function(){
      $modalInstance.dismiss();
    }
  });