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
      products: products
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
      if(data.products.length ===0){
       vm.template.products = products;
      }
    }

    vm.draggable = {
      connectWith: ".dropzone",
      start: function (e, ui) {
        $scope.$apply(function() {
          $scope.dragging = true
        });
        $('.dropzone').sortable('refresh');
      },
      update: function (e, ui) {
        if (ui.item.sortable.droptarget[0].classList[0] !== "dropzone")
          ui.item.sortable.cancel();
      },
      stop: function (e, ui) {

        if (ui.item.sortable.droptarget == undefined) {
          $scope.$apply($scope.dragging = false);
          return;
        }else if (ui.item.sortable.droptarget[0].classList[0] == "dropzone") {
          // run code when item is dropped in the dropzone
          $scope.$apply($scope.dragging = false);
        }else{
          $scope.$apply($scope.dragging = false);
        }

      }
    };


  });