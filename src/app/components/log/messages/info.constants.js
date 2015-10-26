'use strict'

angular.module('log')
  .constant('INFO_MESSAGES', {
    noFacilityInAdminLevels: {
      title: 'Empty facility list',
      message: 'Please select different admin levels or upload facilities for selected levels'
    },
    canceledAssumptionEdit: {
      title: 'Update cancelled',
      message: 'editing assumption cancelled'
    },
    missingAllocTemplateProducts: {
      title: 'Incomplete allocation template',
      message: 'Allocation template does not have required properties',
      remedy: 'Please, notify support team'
    }
  })
