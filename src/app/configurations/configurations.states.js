/**
 * Created by ehealthafrica on 7/1/15.
 */

angular.module('configurations')
  .config(function($stateProvider){

    $stateProvider.state('configurations', {
      parent: 'index',
      //abstract: true,
      url: '/configurations',
      templateUrl: 'app/configurations/index.html',
      controller: function($state){
        $state.go('configurations.layout')
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