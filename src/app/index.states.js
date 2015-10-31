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
                  .catch($q.when.bind($q))
              },
              userStates: function (usersService, log) {
                return usersService.getUserStates()
                  .catch(function (reason) {
                    log.error('userStatesErr', reason)
                    return []
                  })
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
