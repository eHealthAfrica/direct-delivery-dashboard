'use strict'

angular.module('planning')
  .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('planning.schedule', {
      url: '/schedule/:roundId',
      templateUrl: 'app/planning/schedule/index.html',
      controller: 'ScheduleRoundCtrl',
      controllerAs: 'srCtrl',
      resolve: {
        authorization: function ($q, ehaCouchDbAuthService, authService, $stateParams) {
          var role = authService.roundToStateRole($stateParams.roundId)
          var auth = ehaCouchDbAuthServiceProvider.requireUserWithRoles([role])
          return auth(ehaCouchDbAuthService, $q)
        },
        deliveryRound: function (log, planningService, $stateParams) {
          function handleError (err) {
            log.error('deliveryRoundNotFound', err)
            throw err // block $state transition
          }
          return planningService.getByRoundId($stateParams.roundId)
            .catch(handleError)
        },
        dailyDeliveries: function (deliveryService, $stateParams) {
          function handleError () {
            return [] // default value
          }
          return deliveryService.getByRoundId($stateParams.roundId)
            .catch(handleError)
        }
      }
    })
  })
