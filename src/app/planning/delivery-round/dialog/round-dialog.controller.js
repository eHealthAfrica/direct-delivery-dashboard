'use strict'

angular.module('planning')
  .controller('RoundDialogCtrl', function (
    log,
    $modalInstance,
    config,
    deliveryRound,
    $state,
    planningService,
    stateAdminLevels,
    ROUND_STATUS,
    scheduleService,
    mailerService,
    selectedStateName,
    dailyDeliveries
  ) {
    var vm = this // view model
    var isCompleteSchedule = true
    vm.edit = false
    vm.ROUND_STATUS = ROUND_STATUS

    if (!angular.isObject(deliveryRound)) {
      vm.deliveryRound = {
        state: '',
        stateCode: '',
        roundNo: '',
        status: vm.ROUND_STATUS.PLANNING,
        startDate: new Date(),
        endDate: ''
      }
    } else {
      vm.deliveryRound = deliveryRound
      vm.edit = true
    }

    vm.states = stateAdminLevels
    vm.isScheduleComplete = function () {
      return scheduleService.isScheduleComplete(dailyDeliveries)
    }

    function openDatePicker ($event) {
      $event.preventDefault()
      $event.stopPropagation()
      this.opened = true
      if (this.name === 'start') {
        vm.end.opened = false
        return
      }
      vm.start.opened = false
    }

    vm.dateFormat = config.dateFormat
    vm.start = {
      name: 'start',
      opened: false,
      open: openDatePicker
    }

    vm.setStateCode = function () {
      var state
      var i = vm.states.length
      while (i--) {
        state = vm.states[i]
        if (angular.isString(state.name) && state.name.toLowerCase() === vm.deliveryRound.state.toLocaleLowerCase()) {
          vm.deliveryRound.stateCode = state._id
          break
        }
      }
    }

    if (selectedStateName && !angular.isObject(deliveryRound)) {
      vm.deliveryRound.state = selectedStateName
      vm.setStateCode()
    }

    vm.setRoundNumber = function () {
      if (angular.isString(vm.deliveryRound._id) && !vm.deliveryRound.roundNo) {
        var strList = vm.deliveryRound._id.split('-')
        var roundNoIndex = 1
        vm.deliveryRound.roundNo = strList[roundNoIndex]
      }
    }

    vm.setRoundNumber()

    vm.getRoundCode = function () {
      return planningService.getRoundCode(vm.deliveryRound)
    }

    vm.end = {
      name: 'end',
      opened: false,
      open: openDatePicker
    }

    function onSuccessContinue (res) {
      log.success('savedDeliveryRound')
      $modalInstance.close(res)
      var params = { roundId: vm.getRoundCode() }
      $state.go('planning.schedule', params)
    }

    function onSuccessExit (res) {
      log.success('savedDeliveryRound')
      $state.go('planning.deliveryRound', $state.params, { reload: true })
        .finally(function () {
          $modalInstance.close(res)
        })
    }

    function generateMsgBody (round) {
      return scheduleService.getStartRoundEmailTemplate(round)
    }

    function sendEmail (round) {
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
          return scheduleService.getAlertReceiversForRound(round)
        })
        .then(function (result) {
          email.addRecipients(result.emails)
          return mailerService.send(email)
        })
        .catch(function (err) {
          log.error('notificationErr', err)
        })
    }

    function createAndContinue () {
      planningService.createRound(vm.deliveryRound)
        .then(function (data) {
          return sendEmail(angular.extend({}, vm.deliveryRound, data))
        })
        .then(onSuccessContinue)
        .catch(planningService.onSaveError)
    }

    function saveEditAndContinue () {
      saveRound()
        .then(onSuccessContinue)
        .catch(planningService.onSaveError)
    }

    function createAndExit () {
      planningService.createRound(vm.deliveryRound)
        .then(function (data) {
          return sendEmail(angular.extend({}, vm.deliveryRound, data))
        })
        .then(onSuccessExit)
        .catch(planningService.onSaveError)
    }

    function saveEditAndExit () {
      saveRound()
        .then(onSuccessExit)
        .catch(planningService.onSaveError)
    }

    function saveRound () {
      var isCompleteSchedule = scheduleService.isScheduleComplete(vm.deliveryRound)
      if (vm.deliveryRound.status.toLowerCase() !== 'planning' && !isCompleteSchedule) {
        vm.deliveryRound.status = 'Planning'
        log.error('inCompleteScheduleErr')
      }
      return planningService.saveRound(vm.deliveryRound)
    }

    vm.continue = function () {
      if (vm.edit) {
        saveEditAndContinue()
      } else {
        createAndContinue()
      }
    }

    vm.saveAndExit = function () {
      if (vm.edit) {
        saveEditAndExit()
      } else {
        createAndExit()
      }
    }

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
