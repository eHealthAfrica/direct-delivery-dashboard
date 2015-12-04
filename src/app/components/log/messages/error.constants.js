'use strict'

angular.module('log')
  .constant('ERROR_MESSAGES', {
    stateChangeError: {
      title: 'Application error',
      message: 'Could not load page',
      remedy: 'Please try that again'
    },
    unknownError: {
      title: 'Error',
      message: 'An error has occurred',
      remedy: 'Please try again'
    },
    loginFailed: {
      title: 'Login failed',
      message: 'We could not log you in',
      remedy: 'Please try again'
    },
    networkError: {
      title: 'Network',
      message: 'Network error',
      remedy: 'Please check your internet connection and try again'
    },
    userExists: {
      title: 'Users',
      message: 'A user with the specified email exists',
      remedy: 'Please use another email address'
    },
    invalidUserId: {
      title: 'Users',
      message: 'Invalid user id',
      remedy: 'Please select a valid user from the list'
    },
    unauthorizedAccess: {
      title: 'Unauthorized access',
      message: 'You are not allowed to access perform this operation',
      remedy: 'Please, re-login, try again if you have access and contact support if it persists'
    },
    updateConflict: {
      title: 'Document update conflict',
      message: 'The document you want to modified has been updated or created',
      remedy: 'Please, refresh and try again'
    },
    saveDeliveryRoundFailed: {
      title: 'Save delivery round failed',
      message: 'An unknown error occurred while saving delivery round',
      remedy: 'Please, try again and contact support if it persists'
    },
    deliveryRoundNotFound: {
      title: 'Delivery round does not exist',
      message: 'Sorry, could not find delivery round, maybe it has been deleted',
      remedy: 'Please, create a new delivery round or contact support'
    },
    deliveryRoundDoesNotHaveDailySchedule: {
      title: 'Daily schedules not available',
      message: 'Delivery round does not have daily schedules',
      remedy: 'Select another round or use other scheduling options'
    },
    saveBatchScheduleFailed: {
      title: 'Batch schedules save failed',
      message: 'An error occurred while saving schedules',
      remedy: 'Please, try again if this persists, contact support.'
    },
    selectLevelToImportFromErr: {
      title: 'Select administrative level to import from',
      message: '',
      remedy: 'Please, select administrative level and sub-levels'
    },
    fetchByAncestorsFailed: {
      title: 'Fetch locations failed',
      message: 'An error while retrieving facilities under selected areas',
      remedy: 'Please, try again if this persists contact support.'
    },
    assumptionSaveFailed: {
      title: 'Saving failed',
      message: 'An unknown error occurred while saving assumption',
      remedy: 'Please, try again and contact support if it persists'
    },
    cumulativeReportErr: {
      title: 'Report error',
      message: 'An error occurred while generating report',
      remedy: 'Please, try again and contact support if it persists'
    },
    getAllocationError: {
      title: 'Allocation error',
      message: 'An error occurred while retrieving lga allocation',
      remedy: 'Please, refresh and try again and contact support if it persists'
    },
    updatePackedQtyErr: {
      title: 'An Unknown error occurred',
      message: 'An error occurred while saving updated packed quantities',
      remedy: 'Please, refresh and try again and contact support if it persists'
    },
    getReturnRoutesErr: {
      title: 'Failed to retrieve return routes',
      message: 'An unknown error occurred while retrieving return routes',
      remedy: 'Please, try again and contact support if it persists'
    },
    saveReturnRouteErr: {
      title: 'Failed to save return routes',
      message: 'An unknown error occurred while saving return route',
      remedy: 'Please, try again and contact support if it persists'
    },
    getPackingStoresErr: {
      title: 'Failed to retrieve packing store list',
      message: 'An unknown error occurred while retrieving packing store list',
      remedy: 'Please, try again and contact support if it persists affects your work'
    },
    logoutFailed: {
      title: 'Logout failed',
      message: 'Could not logout',
      remedy: 'Please, try again and contact support if it persists'
    },
    plannerNotificationEmailErr: {
      title: 'Email alert failed',
      message: 'Could not send email alert due to unknown error',
      remedy: 'Please, try again and contact support if it persists'
    },
    saveKPIError: {
      title: 'Save KPI failed',
      message: 'Could not save KPI record',
      remedy: 'Please, try again and contact support if it persists'
    },
    assignKPIFromTemplateErr: {
      title: 'Assign KPI error',
      message: 'An unknown error occurred while filling in missing KPI',
      remedy: 'Please, try again and contact support if it persists'
    },
    updateCCEStatusErr: {
      title: 'CCE Status update error',
      message: 'An unknown error occurred while updating CCE Status',
      remedy: 'Please, try again and contact support if it persists'
    },
    locationLoadErr: {
      title: 'Location load error',
      message: 'An unknown error occurred while locations',
      remedy: 'Please, try again and contact support if it persists'
    },
    userLoadErr: {
      title: 'User Load error',
      message: 'An unknown error occurred while loading users',
      remedy: 'Please, try again and contact support if it persists'
    },
    invoiceDailyDeliveryErr: {
      title: 'Daily Delivery Invoice error',
      message: 'An unknown error occurred while loading Invoice for selected round',
      remedy: 'Please, try again and contact support if it persists'
    },
    invoiceRoundListErr: {
      title: 'Delivery Rounds error',
      message: 'An unknown error occurred while loading delivery rounds',
      remedy: 'Please, try again and contact support if it persists'
    },
    InvalidFileImport: {
      title: 'File not Uploaded',
      message: 'An unknown error occurred while uploading file',
      remedy: 'Please, check the file, make corrections and try again and contact support if it persists'
    },
    locationSaveErr: {
      title: 'Saving location failed',
      message: 'Error occurred while saving locations',
      remedy: 'Please, try again and contact support if it persists'
    },
    userStatesErr: {
      title: 'User States error',
      message: 'An unknown error occurred while fetching states for user',
      remedy: 'Please, try again and contact support if it persists'
    },
    userHasNoState: {
      title: 'User has no state',
      message: 'Current user account has no state assigned',
      remedy: 'Kindly contact server administrator to assign state to your account'
    },
    deliveryReportErr: {
      title: 'Delivery Report error',
      message: 'An unknown error occurred while loading delivery report',
      remedy: 'Please, try again and contact support if it persists'
    },
    stateSelectionErr: {
      title: 'State selection error',
      message: 'Error occured while trying to change the state',
      remedy: 'Please, try again and contact support if it persists'
    },
    notificationErr: {
      title: 'Notification error',
      message: 'Error occured while trying to send email',
      remedy: 'Please, contact support if it persists'
    }
  })
