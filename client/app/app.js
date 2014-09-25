'use strict';

angular.module('lmisApp', [
    'config',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngCsv',
    'nvd3ChartDirectives',
    'ui.bootstrap'
  ])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location, SETTINGS) {
    return {
      // Add authorization token to headers
      request: function(config) {
        if (config.url.indexOf(SETTINGS.dbUrl) !== 0) { // do not send auth to couch (remove when all communication goes to node server)
          config.headers = config.headers || {};
          if ($cookieStore.get('token')) {
            config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
          }
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $location, SETTINGS, utility, Auth, State, Zone, LGA, Ward, Facility) {
    $rootScope.SETTINGS = SETTINGS;

    $rootScope.getFileName = utility.getFileName;

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    $rootScope.dataProvider = {
      loadingStates: false,
      getStates: function(value) {
        this.loadingStates = true;
        return State.names(value)
          .finally(function() {
            this.loadingStates = false;
          }.bind(this));
      },
      loadingZones: false,
      getZones: function(value) {
        this.loadingZones = true;
        return Zone.names(value)
          .finally(function() {
            this.loadingZones = false;
          }.bind(this));
      },
      loadingLgas: false,
      getLgas: function(value) {
        this.loadingLgas = true;
        return LGA.names(value)
          .finally(function() {
            this.loadingLgas = false;
          }.bind(this));
      },
      loadingWards: false,
      getWards: function(value) {
        this.loadingWards = true;
        return Ward.names(value)
          .finally(function() {
            this.loadingWards = false;
          }.bind(this));
      },
      loadingFacilities: false,
      getFacilities: function(value) {
        this.loadingFacilities = true;
        return Facility.names(value)
          .finally(function() {
            this.loadingFacilities = false;
          }.bind(this));
      }
    };
  });