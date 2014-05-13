'use strict';

angular
  .module('lmisApp', [
    'ngSanitize',
    'ngRoute',
    'pouchdb'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          facilities: function(Facility) {
            return Facility.all();
          },
          products: function(Product) {
            return Product.all();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
