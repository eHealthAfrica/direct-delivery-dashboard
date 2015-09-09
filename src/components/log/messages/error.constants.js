'use strict';

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
    authInvalid: {
      title: 'Authentication',
      message: 'Invalid username or password',
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
    targetPopSave: {
      title: 'saving failed',
      message: 'error occurred while saving target population record'
    }
  });
