'use strict';

angular.module('delivery')
  .filter('deliveryStatus', function(DELIVERY_STATUS) {
    return function(value, getClass) {
      var status = 'Unknown';
      var cssClass = '';

      if (value) {
        switch (value.status) {
          case DELIVERY_STATUS.PENDING:
            status = 'Pending';
            break;
          case DELIVERY_STATUS.COMPLETED:
            status = 'Success';
            cssClass = 'success';
            break;
          case DELIVERY_STATUS.CANCELLED_AHEAD:
            status = 'Cancelled Ahead';
            cssClass = 'warning';
            break;
          case DELIVERY_STATUS.CANCELLED:
            if (value.cancelReport) {
              if (value.cancelReport.hfNotAvailable) {
                status = 'Failed-Unavailable';
                cssClass = 'danger';
              }
              else if (value.cancelReport.brokenCCE) {
                status = 'Cancelled-CCE';
                cssClass = 'warning';
              }
              else if (value.cancelReport.noCCE) {
                status = 'Failed-CCE';
                cssClass = 'danger';
              }
              else if (value.cancelReport.others) {
                status = 'Cancelled-Other';
                cssClass = 'warning';
              }
            }
            break;
        }
      }

      return getClass ? cssClass : status;
    };
  });
