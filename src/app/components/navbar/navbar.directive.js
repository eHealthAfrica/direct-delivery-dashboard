/**
 * Created by chima on 11/17/15.
 */
angular.module('navbar').directive('ehaDropdownMenu', function(){
  return {
     scope: {items: '=', selectedItem: '=', onSelect: '&', selectedItemAsLabel: '='},
     templateUrl: function (tElem, tAttrs) {
       return '/app/components/navbar/navbar.dropdown.template.html'
     },
     restrict: 'E',
     replace: true,
     compile: function (tElem, tAttrs) {
       var position = tAttrs.floatNav || 'right'
       if(position === 'left'){
         tElem.removeClass('navbar-right').addClass('navbar-left')
       }else{
        tElem.removeClass('navbar-left').addClass('navbar-right')
       }

       tAttrs.iconClass  && tElem.find('button i').addClass(tAttrs.iconClass )
       return function (scope) {

        function initialize () {

          if(scope.selectedItemAsLabel){
            return
          }

          if(!scope.selectedItem){
            scope.selectedItem = scope.items[0]
          }
          scope.onSelect()(scope.selectedItem);
        }
         initialize()
        scope.changeItem = function (item) {
          if(scope.selectedItemAsLabel){
            scope.onSelect()(item);
          }else{
            scope.selectedItem = scope.items.filter(function (it){
              return angular.equals(item, it)
            })[0]
            scope.onSelect()(scope.selectedItem);
          }
        }

       }
     }
  }
})
