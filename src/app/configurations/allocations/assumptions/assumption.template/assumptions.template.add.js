/**
 * Created by ehealthafrica on 7/27/15.
 */

angular.module('allocations')
  .controller('AssumptionsTemplateAddCtrl', function($scope, data, products){

    var vm = this;
    vm.template = {
      _id: '',
      description: '',
      primary: {
        state: '',
        year: ''
      },
      products: []
    };

    vm.productList = products;
    vm.dragging = false;



    if(data){
      vm.template._id = data._id || '';
      vm.template.description = data.description || '';
      vm.template.primary.year = data.primary.year || '';
      vm.template.primary.state = data.primary.state || '';

      if(angular.isArray(data.products)){
       vm.template.products = data.products;
      }

    }

  });