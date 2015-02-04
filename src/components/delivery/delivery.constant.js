'use strict';

angular.module('delivery')
  .constant('DELIVERY_STATUS', {
    PENDING: 'pending',
    CANCELLED_AHEAD: 'cancelled-ahead',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  });
