'use strict'

angular.module('planning')
  .config(function ($stateProvider) {
    $stateProvider.state('planning.deliveryRound', {
      url: '/delivery-round',
      templateUrl: 'app/planning/delivery-round/index.html',
      controller: 'DeliveryRoundCtrl',
      controllerAs: 'crCtrl',
      resolve: {
        deliveryRounds: function (planningService, indexService, $rootScope) {
          return indexService.getUserStates()
            .then(function (states) {
              var state = angular.isDefined($rootScope.selectedState) ? $rootScope.selectedState._id : states[0]._id
              return planningService.byAuthorisedStates([state])
                .catch(function () {
                  return []
                })
            })
        }
      },
      data: {
        label: 'Planning'
      }
    })
  })
