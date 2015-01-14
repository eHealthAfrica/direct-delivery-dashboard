'use strict';

angular.module('directDeliveryDashboard')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          root: {
            templateUrl: 'app/index.html',
            controller: 'IndexCtrl'
          }
        }
      })
      .state('index', {
        parent: 'root',
        abstract: true,
        views: {
          header: {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbarCtrl'
          },
          content: {},
          footer: {
            templateUrl: 'components/footer/footer.html',
            controller: 'FooterCtrl',
            controllerAs: 'footerCtrl'
          }
        }
      });
  });
