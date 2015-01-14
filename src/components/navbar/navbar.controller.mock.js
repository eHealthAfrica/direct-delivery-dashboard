'use strict';

angular.module('navbarCtrlMock', [])
  .constant('config', {
    name: 'test'
  })
  .constant('navbarItemsMock', [
    {
      name: 'parent',
      label: 'Parent'
    }
  ]);
