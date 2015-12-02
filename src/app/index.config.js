/**
 * Created by chima on 12/2/15.
 */
angular.module('directDeliveryDashboard')
  .config(function ($compileProvider, config, $logProvider) {
    $compileProvider.debugInfoEnabled(!config.disableDebug)
    $logProvider.debugEnabled(!config.disableDebug)
  })
