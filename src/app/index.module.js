'use strict'

angular
  .module('directDeliveryDashboard', [
    'ngSanitize',
    'xeditable',
    'ngCsv',
    'ngCsvImport',
    'nvd3ChartDirectives',
    'gantt',
    'gantt.tooltips',
    'core',
    'navbar',
    'footer',
    'home',
    'planning',
    'log',
    'login',
    'reports',
    'planning',
    'facility',
    'users',
    'db',
    'location',
    'configurations',
    'allocations',
    'products',
    'configurations.facilities',
    'utility',
    'eha-drag-n-drop',
    'Measurements',
    'configurations.locations'
  ])
  .run(function (indexService) {
    indexService.bootstrap()
  })
