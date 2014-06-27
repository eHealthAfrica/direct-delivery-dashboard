'use strict';

angular
  .module('lmisApp', [
    'ngSanitize',
    'ngRoute',
    'pouchdb',
    'nvd3ChartDirectives',
    'ui.bootstrap'
  ])
  .constant('SETTINGS', {
    dbUrl: 'http://dev.lomis.ehealth.org.ng:5984/',
    dateFormat: 'yyyy-MM-dd',
    dateTimeFormat: 'yyyy-MM-dd HH:mm'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
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
      })
      .when('/ccu-breakdown', {
        templateUrl: 'views/ccu_breakdown.html',
        controller: 'CCUBreakdownCtrl'
      })
      .when('/stock-count', {
        templateUrl: 'views/stock_count.html',
        controller: 'StockCountCtrl'
      })
      .when('/stock-out', {
        templateUrl: 'views/stock_out.html',
        controller: 'StockOutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $q, SETTINGS, State, Zone, LGA, Ward, Facility) {
    $rootScope.SETTINGS = SETTINGS;

    $rootScope.dataProvider = {
      loadingStates: false,
      getStates: function (value) {
        this.loadingStates = true;
        return State.names(value)
          .finally(function () {
            this.loadingStates = false;
          }.bind(this));
      },
      loadingZones: false,
      getZones: function (value) {
        this.loadingZones = true;
        return Zone.names(value)
          .finally(function () {
            this.loadingZones = false;
          }.bind(this));
      },
      loadingLgas: false,
      getLgas: function (value) {
        this.loadingLgas = true;
        return LGA.names(value)
          .finally(function () {
            this.loadingLgas = false;
          }.bind(this));
      },
      loadingWards: false,
      getWards: function (value) {
        this.loadingWards = true;
        return Ward.names(value)
          .finally(function () {
            this.loadingWards = false;
          }.bind(this));
      },
      loadingFacilities: false,
      getFacilities: function (value) {
        this.loadingFacilities = true;
        return Facility.names(value)
          .finally(function () {
            this.loadingFacilities = false;
          }.bind(this));
      }
    };
  })
  .controller('NavBar', function ($scope, $location) {
    $scope.isActive = function (url) {
      return url == $location.path();
    }
  });
