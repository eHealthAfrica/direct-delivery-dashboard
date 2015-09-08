'use strict';

angular.module('configurations')
  .config(function($stateProvider){

    $stateProvider.state('configurations', {
      parent: 'index',
      //abstract: true,
      url: '/configurations',
      templateUrl: 'app/configurations/index.html',
      controller: function($state){
        if($state.current.name ==='configurations'){
          $state.go('configurations.allocations.assumptions')
        }
      },
      data: {
        label: 'Configurations'
      }
    })
      .state('configurations.layout', {
        parent: 'configurations',
        views: {
          "menu": {
            templateUrl: "app/configurations/menu/menu.html"
          },
          "configurations.content": {}
        }
      })

  });