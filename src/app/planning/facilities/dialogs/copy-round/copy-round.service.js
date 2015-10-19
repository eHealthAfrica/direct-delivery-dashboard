'use strict'

angular.module('planning')
  .service('copyRoundService', function (DELIVERY_STATUS) {
    var _this = this

    _this.shouldResetStatus = function (status) {
      return (status !== DELIVERY_STATUS.CANCELED_CCE && status !== DELIVERY_STATUS.FAILED_CCE)
    }

    var newStatus = DELIVERY_STATUS.UPCOMING_FIRST

    function clearPackingList (packingList) {
      delete packingList.packedQty
      return packingList
    }

    function clearPackedProducts (packedProducts) {
      return packedProducts.map(function (packedProduct) {
        delete packedProduct.returnedQty
        delete packedProduct.onHandQty
        delete packedProduct.deliveredQty
        delete packedProduct.receivedInterimStock
        delete packedProduct.btwDeliveryReceivedQty
        return packedProduct
      })
    }

    function clearFacRnd (facRnd) {
      delete facRnd.arrivedAt
      delete facRnd.receivedBy
      delete facRnd.recipientPhoneNo
      delete facRnd.drop
      delete facRnd.window
      facRnd.signature = {}
      facRnd.cancelReport = {}

      if (_this.shouldResetStatus(facRnd.status)) {
        facRnd.status = newStatus
      }
      // clear packed product
      if (angular.isArray(facRnd.packedProduct)) {
        facRnd.packedProduct = clearPackedProducts(facRnd.packedProduct)
      }
      return facRnd
    }

    this.prepareFromTemplate = function (currentRoundId, roundDailySchedules) {
      function cleanUpASchedule (dailySchedule) {
        var temp = angular.copy(dailySchedule)
        temp.deliveryRoundID = currentRoundId
        temp.date = ''
        delete temp._id
        delete temp._rev
        delete temp.createdOn
        delete temp.modifiedOn

        if (temp.balance) {
          delete temp.balance
        }

        if (angular.isArray(temp.packingList)) {
          temp.packingList = temp.packingList.map(clearPackingList)
        }

        if (angular.isArray(temp.facilityRounds)) {
          temp.facilityRounds = temp.facilityRounds.map(clearFacRnd)
        }

        return temp
      }

      return roundDailySchedules.map(cleanUpASchedule)
    }

    _this.isSelectedFacilityRound = function (facilityRound, selectedFacilities) {
      var facility = facilityRound.facility
      return (facility && selectedFacilities[facility.id] === true)
    }

    _this.copySchedules = function (template, selectedFacilityList) {
      console.log(selectedFacilityList)
      var result = []
      var currentRoundTemplate = angular.copy(template)
      var selectedList = angular.copy(selectedFacilityList)
      currentRoundTemplate.forEach(function (dailySchedule) {
        if (angular.isArray(dailySchedule.facilityRounds)) {
          dailySchedule.facilityRounds = dailySchedule.facilityRounds
            .filter(function (facilityRnd) {
              return _this.isSelectedFacilityRound(facilityRnd, selectedList)
            })
          if (dailySchedule.facilityRounds.length > 0) {
            console.warn(dailySchedule.facilityRounds)
            result.push(dailySchedule) // skip empty facility rounds
          }
        }
      })
      return result
    }
  })
