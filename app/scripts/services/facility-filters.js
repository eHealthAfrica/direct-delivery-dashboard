'use strict';

angular.module('lmisApp')
  .constant('FACILITY_FILTERS', [
    {
      value: true,
      label: 'Non reporting'
    },
    {
      value: false,
      label: 'Reporting'
    },
    {
      value: '',
      label: 'All'
    }
  ]);
