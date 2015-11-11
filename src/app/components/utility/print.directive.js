/**
 * Created by chima on 11/11/15.
 */

angular.module('utility')
  .directive('ehaPrintDiv', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.click(function(event){
          event.preventDefault()
          var div = attrs.ehaPrintDiv
          $('#'+div).print()
        })
      }
    }
  })

