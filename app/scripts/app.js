'use strict';

angular
  .module('lmisApp', [
    'ngSanitize',
    'ngRoute',
    'pouchdb',
    'nvd3ChartDirectives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          facilities: ['Facility', function(Facility) {
            return Facility.all();
          }],
          products: ['Product', function(Product) {
            return Product.all();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
