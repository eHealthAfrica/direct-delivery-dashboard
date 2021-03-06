'use strict'

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
    assumptionSaved: {
      title: 'Template saved successfully',
      message: 'A new assumption template has been created successfully!'
    },
    assumptionEdited: {
      title: 'Update successfully',
      message: 'Assumption edited successfully!'
    },
    targetPopulationEdited: {
      title: 'Target population edited',
      message: 'Target has been edited successfully'
    },
    productSave: {
      title: 'Product saved successfully',
      message: 'Product has been saved successfully'
    },
    updateFacilityPackedQty: {
      title: 'Facility packed quantities updated successfully',
      message: 'Product packing quantities was saved successfully!'
    },
    returnRouteSaved: {
      title: 'Return route updated',
      message: 'Return route update was saved successfully!'
    },
    plannerNotificationEmailSuccess: {
      title: 'Email Notification Sent Successfully',
      message: 'Email alert has been sent to designated recipients!'
    },
    saveKPISuccess: {
      title: 'KPI record saved',
      message: 'KPI record was saved successfully!'
    },
    locationSaveSuccess: {
      title: 'Locations saved',
      message: 'Location(s) saved successfully'
    }
  })
