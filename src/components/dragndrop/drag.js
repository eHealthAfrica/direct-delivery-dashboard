'use strict';

angular.module('eha-drag-n-drop', [])
  .directive('ehaDraggable', function(){
    return {
      scope: {
        dragStartHandler: "=dragStart"
      },
      link: function(scope, element, attr){
        console.log(scope);
        element[0].addEventListener('dragstart', scope.dragStartHandler, false)
      }
    }
  });