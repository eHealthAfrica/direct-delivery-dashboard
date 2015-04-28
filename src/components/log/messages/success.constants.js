'use strict';

angular.module('log')
  .constant('SUCCESS_MESSAGES', {
    authSuccess: {
      title: 'Authentication',
      message: 'Login success'
    },
    userCreated: {
      title: 'Users',
      message: 'User created'
    },
    userUpdated: {
      title: 'Users',
      message: 'User updated'
    },
    userRemoved: {
      title: 'Users',
      message: 'User deleted'
    }
  });
