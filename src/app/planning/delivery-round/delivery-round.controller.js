'use strict'

angular.module('planning')
  .controller('DeliveryRoundCtrl', function (
    $modal,
    deliveryRounds,
    deliveryRoundService,
    planningService,
    $scope,
    authService,
    mailerService, config, scheduleService, log
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
      authService.getUserSelectedState(true)
        .then(function (state) {
          return planningService.byAuthorisedStates([state])
        })
        .then(function (deliveryRounds) {
          vm.deliveryRounds = deliveryRounds
        })
        .catch(function () {
          vm.deliveryRounds = []
        })
    })
    function generateMsgBody (round) {
      return scheduleService.getRoundEmailTemplate(round)
    }
    function emailNotification (round) {
      var mailConfig = {
        apiUrl: config.mailerAPI,
        apiKey: config.apiKey
      }
      mailerService.setConfig(mailConfig)
      var email = mailerService.Email()
      email.setSender(config.senderEmail, config.senderName)

      return generateMsgBody(round)
        .then(function (result) {
          email.setSubject(result.subject)
          email.setHTML(result.msg)
          return email
        })
        .then(function () {
          return scheduleService.getAlertReceiversForRound(round)
        })
        .then(function (result) {
          email.addRecipients(result.emails)
          return email
        })
        .then(function () {
          return mailerService.send(email)
        }).catch(function (err) {
          log.error('notificationErr', err)
        })
    }

    vm.completePlanning = function (deliveryRound) {
      planningService.completePlanning(deliveryRound)
        .then(function () {
          emailNotification(deliveryRound)
            .then(function () {
              log.success('plannerNotificationEmailSuccess')
            })
            .catch(function (err) {
              log.error('plannerNotificationEmailErr', err)
            })
          log.success('completePlanningSuccess')
        })
        .catch(planningService.onSaveError)
    }
  })
