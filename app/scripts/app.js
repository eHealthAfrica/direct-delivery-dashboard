'use strict';

angular
  .module('lmisApp', [
    'config',
    'ngSanitize',
    'ngRoute',
    'ngResource',
    'ngCsv',
    'nvd3ChartDirectives',
    'ui.bootstrap'
  ])
  .config(function ($httpProvider, $routeProvider) {

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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
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
      .when('/stock-count-summary', {
        templateUrl: 'views/stock-count-summary.html',
        controller: 'StockCountSummaryCtrl'
      })
      .when('/inventory', {
        templateUrl: 'views/inventory.html',
        controller: 'InventoryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Intercept 401s and redirect user to login
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
      return {
        'responseError': function (response) {
          switch (response.status) {
            case 401:
              if ($location.path() != '/login')
                $location.search('back', $location.path()).path('/login');
              break;
          }

          return $q.reject(response);
        }
      };
    }]);
  })
  .run(function ($rootScope, $route, SETTINGS, utility, Auth, State, Zone, LGA, Ward, Facility) {
    $rootScope.SETTINGS = SETTINGS;

    $rootScope.getFileName = utility.getFileName;

    $rootScope.logout = function() {
      Auth.logout()
        .then(function() {
          $route.reload();
        })
    };

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
