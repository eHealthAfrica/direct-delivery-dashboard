'use strict'

angular.module('directDeliveryDashboard')
  .config(function ($compileProvider, $logProvider, config) {
    if (config.disableDebug) {
      $compileProvider.debugInfoEnabled(false)
      $logProvider.debugEnabled(false)
    }
  })
