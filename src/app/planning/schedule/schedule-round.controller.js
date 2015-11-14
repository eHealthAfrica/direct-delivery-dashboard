'use strict'

angular.module('planning')
  .controller('ScheduleRoundCtrl', function (deliveryRound, $state, dailyDeliveries,
    scheduleService, planningService, log, config,
    $modal, utility, $q, DELIVERY_STATUS, mailerService, driversService, $window, $scope) {
    var vm = this
    vm.isSavingList = {}
    vm.deliveryStatuses = DELIVERY_STATUS
    vm.dropList = [
      {value: 1, text: '1'},
      {value: 2, text: '2'},
      {value: 3, text: '3'},
      {value: 4, text: '4'},
      {value: 5, text: '5'},
      {value: 6, text: '6'},
      {value: 7, text: '7'},
      {value: 8, text: '8'},
      {value: 9, text: '9'},
      {value: 10, text: '10'}
    ]

    vm.print = function () {
      $window.jQuery('#print-area').print()
    }

    vm.deliveryRound = deliveryRound
    vm.deliveriesHash = {}
    scheduleService.flatten(dailyDeliveries)
      .forEach(function (row) {
        var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id)
        vm.deliveriesHash[hashId] = row
      })

    function updateDeliveries (deliveries) {
      vm.dailyDeliveries = deliveries
      vm.facilityDeliveries = scheduleService.flatten(vm.dailyDeliveries)
    }

    function loadDrivers () {
      var STATE = $scope.selectedState._id
      driversService.getByState(STATE)
        .then(function (response) {
          vm.drivers = response.map(function (row) {
            return {
              value: row._id,
              text: row._id
            }
          })
        })
    }

    updateDeliveries(dailyDeliveries)

    var exportData = scheduleService.prepareExport(vm.deliveryRound._id, vm.facilityDeliveries)
    vm.exportForRouting = exportData.rows
    vm.exportHeader = exportData.headers

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
          log.success('notificationError', err)
        })
    }

    vm.completePlanning = function () {
      planningService.completePlanning(vm.deliveryRound)
        .then(function () {
          emailNotification(vm.deliveryRound)
            .then(function () {
              log.success('plannerNotificationEmailSuccess')
            })
            .catch(function (err) {
              log.error('plannerNotificationEmailErr', err)
            })
          log.success('completePlanningSuccess')
          $state.go('planning.deliveryRound')
        })
        .catch(planningService.onSaveError)
    }

    function onSuccess (res) {
      log.success('schedulesSaved', res)
      $state.go('planning.schedule', {roundId: vm.deliveryRound._id}, {
        reload: true,
        inherit: false,
        notify: true
      })
    }

    vm.saveAll = function () {
      scheduleService.saveSchedules(vm.dailyDeliveries)
        .then(onSuccess)
        .catch(scheduleService.onSaveError)
    }

    vm.getHash = function (row) {
      return scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id)
    }

    vm.isUpdated = function (row) {
      var hashId = scheduleService.hashRow(row.deliveryRoundID, row.facility.id, row._id)
      var before = vm.deliveriesHash[hashId]
      if (before) {
        return !angular.equals(before, row)
      }
      return false
    }

    vm.getDate = function (date) {
      if (utility.isValidDate(date)) {
        return utility.formatDate(date)
      }
      return ''
    }

    vm.saveRow = function (data, row) {
      // TODO: simplify once old data model has been deprecated in favor of one doc per facility per driver delivery.
      var updatedRow = {
        deliveryDate: new Date(data.deliveryDate).toJSON(),
        distance: data.distance,
        driver: data.driverID,
        drop: data.drop,
        facilityCode: row.facility.id,
        facilityName: row.facility.name,
        id: row._id,
        roundId: vm.deliveryRound._id,
        window: data.window,
        status: data.status
      }
      var hashId = scheduleService.hashRow(updatedRow.roundId, updatedRow.facilityCode, updatedRow.id)

      var hashUpdate = {}
      hashUpdate[hashId] = updatedRow

      var result = scheduleService.applyChanges(dailyDeliveries, hashUpdate)
      var updatedDailyDelivery = result.filter(function (dailyDelivery) {
        return dailyDelivery._id === updatedRow.id
      })

      if (updatedDailyDelivery.length > 0) {
        var doc = utility.takeFirst(updatedDailyDelivery)
        doc.date = utility.formatDate(updatedRow.deliveryDate)
        doc.driverID = data.driverID
        if (angular.isObject(doc)) {
          return scheduleService.save(doc)
            .then(function (res) {
              log.success('schedulesSaved', res)
              // TODO: think of better way to refresh all data after changes though this
              // seems like the easiest and the best chance of having latest server copy while editing
              // but might be having performance issues.
              $state.go('planning.schedule', {roundId: vm.deliveryRound._id}, {
                reload: true,
                inherit: false,
                notify: true
              })
            })
            .catch(scheduleService.onSaveError)
        }
      } else {
        return $q.when(false)
      }
    }
    loadDrivers()
    vm.openImportDialog = function () {
      $modal.open({
        animation: true,
        templateUrl: 'app/planning/schedule/import/schedule-import-dialog.html',
        controller: 'ScheduleDataImportDialogCtrl',
        controllerAs: 'sdidCtrl',
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        resolve: {
          dailyDeliveries: function () {
            return vm.dailyDeliveries
          },
          deliveryRound: function () {
            return vm.deliveryRound
          }
        }
      }).result
        .then(function (updatedDailyDeliveries) {
          updateDeliveries(updatedDailyDeliveries)
        })
    }

    $scope.$on('stateChanged', function (event, data) {
      loadDrivers()
    })
  })
