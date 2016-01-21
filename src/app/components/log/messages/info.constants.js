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
    },
    noRounds: {
      title: 'No delivery rounds',
      message: 'Seem like there is not delivery rounds registered yet',
      remedy: 'Please register a delivery round or contact support if you have already'
    },
    facilitiesRetrievalErr: {
      title: 'Missing Facility Data',
      message: 'The selected LGA does not contain facilities',
      remedy: ''
    }
  })
