'use strict'

angular.module('log')
  .constant('WARNING_MESSAGES', {
    templateLoadFail: {
      title: 'Loading templates failed',
      message: 'could not load template. This is due to either internal or not template has been set.',
      remedy: 'try again or add a new template, if this persist contact support'
    },
    accessDeniedOrExpired: {
      title: 'Access denied',
      message: 'Access is denied either due to wrong login details or session has expired',
      remedy: 'Please login again to create new session'
    },
    noInvoiceData: {
      title: 'No data available',
      message: 'An invoice could not be displayed as no daily delivery data is available',
      remedy: 'Confirm a delivery has been made and try again'
    },
    emptyDataUpload: {
      title: 'Empty data upload',
      message: 'The file you are trying to upload have no data in it',
      remedy: 'please check the file and try again'
    }
  })
