'use strict';

angular.module('log')
  .constant('INFO_MESSAGES', {
      noFacilityInAdminLevels: {
        title: 'Empty facility list',
        message: 'Please select different admin levels or upload facilities for selected levels'
      }
  });
