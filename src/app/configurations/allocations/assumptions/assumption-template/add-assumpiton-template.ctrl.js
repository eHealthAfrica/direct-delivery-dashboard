/**
 * Created by ehealthafrica on 7/27/15.
 */

angular.module('allocations')
  .controller('AssumptionsTemplateAddCtrl', function ($scope, data, products, templateType, states, $modalInstance, $filter) {
    var vm = this
    vm.template = {
      name: '',
      description: '',
      primary: {
        state: '',
        year: ''
      },
      products: {},
      doc_type: templateType
    }
    vm.data = data


    vm.disableSubmit = function (form) {
      var isEmpty = $filter('isEmpty')
      return form.$invalid || isEmpty(vm.template.products)
    }

    vm.productList = products
    vm.dragging = false
    vm.states = states

    if (data) {
      vm.template = data
    }
    vm.updateTemplateProducts = function (product) {
      vm.template.products[product.code] = product
    }
    vm.close = function () {
      $modalInstance.close(vm.template)
    }
    vm.cancel = function () {
      $modalInstance.dismiss()
    }
    (function () {
      vm.templateName = !vm.data ? '' : vm.data.name
    }())
  })
