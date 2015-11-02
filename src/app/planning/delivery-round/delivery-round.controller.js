'use strict'

angular.module('planning')
  .controller('DeliveryRoundCtrl', function (
    $modal,
    deliveryRounds,
    deliveryRoundService
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
  })
