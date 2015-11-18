/**
 * Created by chima on 11/11/15.
 */

angular.module('utility')
  .directive('ehaPrintDiv', function ($compile) {
    return {
      restrict: 'A',
      compile: function (tElem) {
        var btnTpl = "<div class='hidden-print'><button type='button'  ng-click='print(event)' class='{{btnClass}}'>" +
          "<i class='fa fa-print'></i>Print </button></div>"
        var elem = angular.element(btnTpl)
        $compile(elem)
        tElem.prepend(elem)
        return function (scope, element, attrs) {
          scope.btnClass = attrs.printbtnclass || 'btn btn-primary'
          scope.print = function () {
            element.print()
          }
        }
      }
    }
  })
