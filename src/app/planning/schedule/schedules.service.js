'use strict'

angular.module('planning')
  .service('scheduleService', function (dbService, log, utility, pouchUtil, $filter) {
    var _this = this

    _this.getAlertReceiversForRound = function (deliveryRound) {
      var stateCode = deliveryRound.roundCode && deliveryRound.roundCode.split('-')[0] || deliveryRound.id.split('-')[0]
      var view = 'dashboard-delivery-rounds/alert-receivers'
      var options = {include_docs: true, keys: ['all', stateCode]}

      return dbService.getView(view, options)
        .then(function (res) {
          return res
        })
        .then(pouchUtil.pluckValues)
        .then(function (data) {
          var obj = {emails: ['adam@ehealthafrica.org'], phones: []}
          return data.filter(function (item) {
            return item.active
          }).reduce(function (previous, current) {
            current.emails.forEach(function (item) {
              if (!previous.emails.indexOf(item)) {
                previous.emails.push({email: item, type: 'to', name: current.name})
              }
            })
            current.phones.forEach(function (item) {
              if (!previous.phones.indexOf(item)) {
                previous.phones.push(item)
              }
            })
            return previous
          }, obj)
        })
    }

    _this.getRoundEmailTemplate = function (deliveryRound) {
      var doc = 'round-email'
      var options = {include_docs: true}
      return dbService.get(doc, options)
        .then(function (data) {
          var msg = data && data.content && data.content.replace('{roundId}', deliveryRound.roundCode)
          var subject = data && data.subject && data.subject.replace('{roundId}', deliveryRound.roundCode)
          var result = {msg: msg, subject: subject}
          return result
        })
    }

    _this.getStartRoundEmailTemplate = function (deliveryRound) {
      var doc = 'round-start-email'
      var options = {include_docs: true}
      return dbService.get(doc, options)
        .then(function (data) {
          var msg = data && data.content && data.content
              .replace('{roundId}', deliveryRound.id)
              .replace('{state}', deliveryRound.state).replace('{startDate}', $filter('date')(deliveryRound.startDate, 'dd-MM-yyyy'))
              .replace('{endDate}', $filter('date')(deliveryRound.endDate, 'dd-MM-yyyy'))
          var subject = data && data.subject && data.subject.replace('{roundId}', deliveryRound.id)
          var result = {msg: msg, subject: subject}
          return result
        })
    }

    _this.getHeaders = function () {
      return _this.headerIndex
    }

    _this.headerIndex = {
      uuid: {
        text: 'UUID',
        index: 0
      },
      roundCode: {
        text: 'Round Code',
        index: 1
      },
      facilityName: {
        text: 'Facility Name',
        index: 2
      },
      facilityCode: {
        text: 'Facility Code',
        index: 3
      },
      deliveryDate: {
        text: 'Delivery Date',
        index: 4
      },
      driverID: {
        text: 'Driver ID',
        index: 5
      },
      drop: {
        text: 'Drop',
        index: 6
      },
      distance: {
        text: 'Distance (KM)',
        index: 7
      },
      window: {
        text: 'Window',
        index: 8
      }
    }

    _this.saveSchedules = function (dailyDeliveries) {
      var result = dailyDeliveries.map(function (row) {
        if (utility.isValidDate(row.date)) {
          row.date = utility.formatDate(row.date)
        } else {
          row.date = ''
        }
        return row
      })
      return dbService.saveDocs(result)
    }

    _this.save = function (doc) {
      return dbService.save(doc)
    }

    _this.presetDate = function (date) {
      if (utility.isValidDate(date)) {
        return new Date(date)
      }
      return ''
    }

    _this.flatten = function (dailyDeliveries) {
      var schedules = []
      // /TODO: Remove after splitting Daily Delivery doc into
      function flattenSchedule (dailySchedule) {
        if (angular.isArray(dailySchedule.facilityRounds)) {
          dailySchedule.facilityRounds
            .forEach(function (facRnd) {
              var schedule = {
                _id: dailySchedule._id,
                facility: facRnd.facility,
                date: _this.presetDate(dailySchedule.date),
                driverID: dailySchedule.driverID,
                drop: facRnd.drop,
                window: facRnd.window,
                status: facRnd.status,
                distance: facRnd.distance
              }
              schedules.push(schedule)
            })
        } else {
          dailySchedule.date = _this.presetDate(dailySchedule.date)
          schedules.push(dailySchedule)
        }
      }

      dailyDeliveries.forEach(flattenSchedule)
      return schedules
    }

    function getHeaderTexts () {
      var headers = []
      for (var i in _this.headerIndex) {
        if (_this.headerIndex.hasOwnProperty(i)) {
          headers.push(_this.headerIndex[i].text)
        }
      }
      return headers
    }

    _this.prepareExport = function (roundId, dailyDeliveries) {
      var rows = dailyDeliveries.map(function (row) {
        var deliveryDate = ''
        if (utility.isValidDate(row.date)) {
          deliveryDate = utility.formatDate(row.date)
        }
        return {
          uuid: row._id,
          roundId: roundId,
          facilityName: row.facility.name,
          facilityCode: row.facility.id,
          deliveryDate: deliveryDate,
          driver: row.driverID,
          drop: row.drop,
          distance: row.distance,
          window: row.window
        }
      })

      var headers = getHeaderTexts()
        .sort(function (a, b) {
          return a.index - b.index
        })

      return {
        rows: rows,
        headers: headers
      }
    }

    _this.parseCSV = function (csvJSON) {
      var result = {}
      var headers = _this.getHeaders()
      csvJSON.forEach(function (csvRow) {
        var row = {
          id: csvRow[headers.uuid.text],
          roundId: csvRow[headers.roundCode.text],
          facilityName: csvRow[headers.facilityName.text],
          facilityCode: csvRow[headers.facilityCode.text],
          deliveryDate: csvRow[headers.deliveryDate.text],
          driver: csvRow[headers.driverID.text],
          drop: csvRow[headers.drop.text],
          distance: csvRow[headers.distance.text],
          window: csvRow[headers.window.text]
        }
        var rowHash = _this.hashRow(row.roundId, row.facilityCode, row.id)
        result[rowHash] = row
      })
      return result
    }

    _this.hashRow = function (roundId, facilityCode, dailyDeliveryId) {
      return [ roundId, facilityCode, dailyDeliveryId ].join('-')
    }

    _this.applyChanges = function (dailyDeliveries, schedulesInfo) {
      function applyUpdate (dailyDelivery) {
        var rowHash
        var scheduleInfo
        if (angular.isArray(dailyDelivery.facilityRounds)) {
          dailyDelivery.facilityRounds
            .forEach(function (facRnd) {
              rowHash = _this.hashRow(dailyDelivery.deliveryRoundID, facRnd.facility.id, dailyDelivery._id)
              scheduleInfo = schedulesInfo[rowHash]
              if (scheduleInfo) {
                facRnd.drop = scheduleInfo.drop
                facRnd.window = scheduleInfo.window
                facRnd.distance = scheduleInfo.distance
                facRnd.status = scheduleInfo.status
              }
            })
        } else {
          rowHash = _this.hashRow(dailyDelivery.deliveryRoundID, dailyDelivery.facility.id, dailyDelivery._id)
          scheduleInfo = schedulesInfo[rowHash]
          if (scheduleInfo) {
            dailyDelivery.drop = scheduleInfo.drop
            dailyDelivery.window = scheduleInfo.window
            dailyDelivery.distance = scheduleInfo.distance
            dailyDelivery.status = scheduleInfo.status
          }
        }

        if (scheduleInfo) {
          if (dailyDelivery.date !== scheduleInfo.deliveryDate) {
            dailyDelivery.targetDate = dailyDelivery.date
          }
          dailyDelivery.driverID = scheduleInfo.driver
          dailyDelivery.date = scheduleInfo.deliveryDate
        }

        return dailyDelivery
      }

      return dailyDeliveries.map(applyUpdate)
    }

    _this.onSaveError = function (err) {
      if (err.status === 401) {
        return log.error('unauthorizedAccess', err)
      }
      if (err.status === 409) {
        return log.error('updateConflict', err)
      }
      log.error('saveBatchScheduleFailed', err)
    }

    function formatRounds (list) {
      list.sort(function (a, b) {
        return a.drop - b.drop
      })
      return list
    }

    _this.getDaySchedule = function (driverID, date) {
      var deliveryDate = date || new Date()
      var key = driverID + '-' + utility.formatDate(deliveryDate)
      var options = {
        include_docs: true,
        key: key
      }
      return dbService.getView('daily-deliveries/by-driver-date', options)
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
        .then(formatRounds)
    }

    _this.getDriverLastDrop = function (driverId, date) {
      return _this.getDaySchedule(driverId, date)
        .then(function (response) {
          return [response[response.length - 1], response]
        })
    }
  })
