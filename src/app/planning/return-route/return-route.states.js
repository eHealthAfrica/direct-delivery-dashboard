'use strict'

angular.module('planning')
  .config(function ($stateProvider, authProvider) {
    $stateProvider.state('planning.returnRoute', {
      url: '/return-route/:roundId',
      templateUrl: 'app/planning/return-route/index.html',
      controller: 'ReturnRouteCtrl',
      controllerAs: 'rrCtrl',
      resolve: {
        authorization: function ($q, authService, $stateParams) {
          var role = authService.roundToStateRole($stateParams.roundId)
          var auth = authProvider.requireUserWithRoles([role])
          return auth(authService, $q)
        },
        deliveryRound: function (log, planningService, $stateParams) {
          function handleError (err) {
            log.error('deliveryRoundNotFound', err)
            throw err // block $state transition
          }
          return planningService.getByRoundId($stateParams.roundId)
            .catch(handleError)
        },
        deliveryReturnRoutes: function (log, returnRouteService, $stateParams) {
          return returnRouteService.getBy($stateParams.roundId)
            .catch(function (err) {
              log.error('getReturnRoutesErr', err)
              return []
            })
        },
        packingStores: function (log, deliveryRound, returnRouteService) {
          return returnRouteService.getPackingStoreBy(deliveryRound._id)
            .catch(function (err) {
              log.error('getPackingStoresErr', err)
              return []
            })
        }
      }
    })
  })
