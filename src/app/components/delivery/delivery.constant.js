'use strict';

angular.module('delivery')
  .constant('DELIVERY_STATUS', {
    UPCOMING_FIRST: 'Upcoming: 1st Attempt',
    UPCOMING_SECOND: 'Upcoming: 2st Attempt',
    SUCCESS_FIRST: 'Success: 1st Attempt',
    SUCCESS_SECOND: 'Success: 2nd Attempt',
    CANCELED_CCE: 'Canceled: CCE',
    CANCELED_OTHER: 'Canceled: Other',
    CANCELED_STAFF: 'Canceled: Staff availability',
    FAILED_CCE: 'Failed: CCE',
    FAILED_STAFF: 'Failed: Staff availability',
    FAILED_OTHER: 'Failed: other'
  });
