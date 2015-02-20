'use strict';

angular.module('delivery')
  .filter('deliveryStatus', function(DELIVERY_STATUS) {
    return function(value, getClass) {
      var status = (value && value.status) || 'Unknown';
      var cssClass = '';

      if (!getClass) {
        return status;
      }

      switch (status) {
        case DELIVERY_STATUS.SUCCESS_FIRST:
        case DELIVERY_STATUS.SUCCESS_SECOND:
          cssClass = 'success';
          break;

        case DELIVERY_STATUS.CANCELED_CCE:
        case DELIVERY_STATUS.CANCELED_OTHER:
        case DELIVERY_STATUS.CANCELED_STAFF:
          cssClass = 'warning';
          break;

        case DELIVERY_STATUS.FAILED_CCE:
        case DELIVERY_STATUS.FAILED_STAFF:
        case DELIVERY_STATUS.FAILED_OTHER:
          cssClass = 'danger';
          break;

        default:
          break;
      }

      return cssClass;
    };
  });
