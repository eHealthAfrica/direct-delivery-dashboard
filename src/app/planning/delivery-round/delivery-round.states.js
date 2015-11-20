'use strict'

angular.module('planning')
  .config(function ($stateProvider) {
    $stateProvider.state('planning.deliveryRound', {
      url: '/delivery-round',
      templateUrl: 'app/planning/delivery-round/index.html',
      controller: 'DeliveryRoundCtrl',
      controllerAs: 'crCtrl',
      resolve: {
        deliveryRounds: function (planningService, userStateService) {
              return userStateService.getUserSelectedState(true)
                .then(function (state){
                return planningService.byAuthorisedStates([state])
              })
            .catch(function () {
              return []
            })

        }
      },
      data: {
        label: 'Planning'
      }
    })
  })
