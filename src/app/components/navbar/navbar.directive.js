/**
 * Created by chima on 11/17/15.
 */
angular.module('navbar').directive('ehaDropdownMenu', function(){
  return{
     scope: {items: '=', selectedItem: '='},
     templateUrl: '/app/components/navbar/navbar.dropdown.template.html',
     restrict: 'E',
     compile: function (tElem, tAttrs){
       return function (scope, element, attrs){
        scope.changeItem = function (item) {
          scope.selectedItem = scope.items.filter(function (it){
            return angular.equals(item, it)
          })[0]
          console.log(scope.selectedItem)
        }
       }
     }
  }
})
