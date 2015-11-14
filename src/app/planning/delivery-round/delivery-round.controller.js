'use strict'

angular.module('planning')
  .controller('DeliveryRoundCtrl', function (
    $modal,
    deliveryRounds,
    deliveryRoundService,
    planningService,
    $scope
  ) {
    var vm = this
    vm.deliveryRounds = deliveryRounds

    vm.open = function (id) {
      $modal.open({
        animation: true,
        templateUrl: 'app/planning/delivery-round/dialog/round.html',
        controller: 'RoundDialogCtrl',
        controllerAs: 'nrdCtrl',
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          deliveryRound: deliveryRoundService.getDeliveryRound.bind(null, id),
          stateAdminLevels: deliveryRoundService.getStateAdminLevels
        }
      })
    }

    $scope.$on('stateChanged', function (event, data) {
      planningService.byAuthorisedStates([$scope.selectedState._id])
        .then(function (deliveryRounds) {
          vm.deliveryRounds = deliveryRounds
        })
        .catch(function () {
          vm.deliveryRounds = []
        })
    })
  })
