'use strict'

angular.module('planning')
  .service('addFacilityService', function (DELIVERY_STATUS) {
    var _this = this

    _this.prepareSchedules = function (facilities, selected, roundId) {
      var facilitySchedules = []
      facilities.forEach(function (facility) {
        if (selected[facility.id] === true) {
          var facilitySchedule = {
            doc_type: 'dailyDelivery',
            deliveryRoundID: roundId,
            date: '',
            window: '',
            drop: '',
            signature: {},
            cancelReport: {},
            status: DELIVERY_STATUS.UPCOMING_FIRST
          }
          facilitySchedule.facility = facility
          facilitySchedules.push(facilitySchedule)
        }
      })
      return facilitySchedules
    }
  })
