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
    },
    savedDeliveryRound: {
      title: 'Saved delivery round',
      message: 'Delivery round was saved successfully!'
    },
    schedulesSaved: {
      title: 'Schedules saved successfully',
      message: 'Schedules saved successfully!'
    },
    completePlanningSuccess: {
      title: 'Delivery round complete planning',
      message: 'Delivery round planning has been complete and ready for next phase'
    },
    assumptionEdited: {
      title: 'Update successfully',
      message: 'Assumption edited successfully!'
    },
    targetPopulationEdited: {
      title: 'Target population edited',
      message: 'Target has been edited successfully'
    }
  });
