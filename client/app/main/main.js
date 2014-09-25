'use strict';

angular.module('lmisApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          facilities: ['Facility', function (Facility) {
            return Facility.all();
          }],
          productProfiles: ['ProductProfile', function (ProductProfile) {
            return ProductProfile.all();
          }],
          productTypes: ['ProductType', function (ProductType) {
            return ProductType.all();
          }]
        }
      });
  });