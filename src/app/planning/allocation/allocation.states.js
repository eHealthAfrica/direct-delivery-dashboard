'use strict'

angular.module('planning')
  .config(function ($stateProvider, ehaCouchDbAuthServiceProvider) {
    $stateProvider.state('planning.allocation', {
      url: '/allocation/:roundId',
      templateUrl: 'app/planning/allocation/index.html',
      controller: 'DeliveryAllocationCtrl',
      controllerAs: 'daCtrl',
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
        facilityAllocationInfo: function (deliveryAllocationService, $stateParams) {
          function handleError () {
            return {
              rows: [],
              productList: [],
              lgaList: [],
              presentationsByProduct: {}
            } // default value
          }
          return deliveryAllocationService.getAllocationBy($stateParams.roundId)
            .catch(handleError)
        },
        allocationTemplates: function (assumptionService) {
          return assumptionService.getAll()
            .catch(function () {
              return []
            })
        }
      }
    })
  })
