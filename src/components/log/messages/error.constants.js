'use strict';

angular.module('log')
  .constant('ERROR_MESSAGES', {
    stateChangeError: {
      title: 'Application error',
      message: 'Could not load page',
      remedy: 'Please try that again'
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
    unknownError: {
      title: 'Error',
      message: 'An error has occurred',
      remedy: 'Please try again'
    }
  });
