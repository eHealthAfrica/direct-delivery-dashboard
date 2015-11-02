'use strict'

angular.module('navbarCtrlMock', [])
  .constant('config', {
    name: 'test',
    admin: {
      roles: [
        'boss'
      ]
    }
  })
  .constant('navbarItemsMock', [
    {
      name: 'parent',
      label: 'Parent',
      roles: [
        'boss'
      ]
    }
  ])
  .constant('dbService', {})
