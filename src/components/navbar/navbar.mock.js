'use strict';

angular.module('navbarMock', [])
  .service('$state', function() {
    this.get = function() {
      return [
        {
          name: 'parent',
          data: {
            label: 'Parent'
          }
        },
        {
          name: 'parent.child',
          data: {
            label: 'Child'
          }
        }
      ];
    };
  });
