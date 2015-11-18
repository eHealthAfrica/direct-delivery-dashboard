/**
 * Created by chima on 11/17/15.
 */
angular.module('navbar').directive('ehaDropdownMenu', function(){
  return {
     scope: {items: '=', selectedItem: '=', onSelect: '&'},
     templateUrl: '/app/components/navbar/navbar.dropdown.template.html',
     restrict: 'E',
     compile: function (tElem, tAttrs) {
       var position = tAttrs.float || 'right'
       if (position === 'left'){
        var ul = tElem.find('ul.nav')
         tElem.find('ul.nav').removeClass('navbar-right').addClass('navbar-left')
       }
       else {
         tElem.find('ul.nav').removeClass('navbar-left').addClass('navbar-right')
       }

       return function (scope, element, attrs) {

        function initialize () {
          debugger

          if(!scope.selectedItem){
            scope.selectedItem = scope.items[0]
          }
          scope.onSelect()(scope.selectedItem);
        }
         initialize()
        scope.changeItem = function (item) {
          scope.selectedItem = scope.items.filter(function (it){
            return angular.equals(item, it)
          })[0]
          scope.onSelect()(scope.selectedItem);
        }

       }
     }
  }
})
