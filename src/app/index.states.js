'use strict'

angular.module('directDeliveryDashboard')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          root: {
            templateUrl: 'app/index.html'
          }
        }
      })
      .state('index', {
        parent: 'root',
        abstract: true,
        views: {
          header: {
            templateUrl: 'app/components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbarCtrl',
            resolve: {
              authentication: function ($q, authService, navbarService) {
                return authService.getCurrentUser()
                  .then(navbarService.updateItems.bind(null))
                  .then(navbarService.updateUsername.bind(null))
                  .catch($q.when.bind($q))
              }
            }
          },
          content: {},
          footer: {
            templateUrl: 'app/components/footer/footer.html',
            controller: 'FooterCtrl',
            controllerAs: 'footerCtrl'
          }
        }
      })
  })
