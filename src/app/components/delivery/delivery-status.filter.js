'use strict'

angular.module('delivery')
  .filter('deliveryStatus', function (DELIVERY_STATUS) {
    var CLASS = {}

    angular.forEach(DELIVERY_STATUS, function (status) {
      var cssKey = status.trim().toLowerCase()
      var cssClass = ''

      switch (status) {
        case DELIVERY_STATUS.SUCCESS_FIRST:
        case DELIVERY_STATUS.SUCCESS_SECOND:
          cssClass = 'success'
          break

        case DELIVERY_STATUS.CANCELED_CCE:
        case DELIVERY_STATUS.CANCELED_OTHER:
        case DELIVERY_STATUS.CANCELED_STAFF:
          cssClass = 'warning'
          break

        case DELIVERY_STATUS.FAILED_CCE:
        case DELIVERY_STATUS.FAILED_STAFF:
        case DELIVERY_STATUS.FAILED_OTHER:
          cssClass = 'danger'
          break
      }

      CLASS[cssKey] = cssClass
    })

    return function (value, getClass) {
      var status = (value && value.status) || 'Unknown'

      return getClass ? (CLASS[status.trim().toLowerCase()] || '') : status
    }
  })
