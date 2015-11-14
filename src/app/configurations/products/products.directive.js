/**
 * Created by ehealthafrica on 7/7/15.
 */

angular.module('products')
  .directive('ehaUniqueProduct', function (productService, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (value) {
          var params = scope.$eval(attrs.ehaUniqueProduct)
          if (!value || !value.trim()) {
            return value
          }
          ngModel.pending = true
          $timeout(function () {
            productService.get(value)
              .then(function (data) {
                return (!data || data._id === params.id)
              })
              .then(function (data) {
                ngModel.$setValidity('productUnique', data)
                ngModel.pending = false
              })
              .catch(function () {
                ngModel.$setValidity('productUnique', true)
                ngModel.pending = false
              })
          }, 2000)
          return value
        })
      }
    }
  })
