'use strict';

angular.module('log')
  .constant('WARNING_MESSAGES', {
    templateLoadFail: {
      title: 'Loading templates failed',
      message: 'could not load template. This is due to either internal or not template has been set.',
      remedy: 'try again or add a new template, if this persist contact support'
    }
  });
