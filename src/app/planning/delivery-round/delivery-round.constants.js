'use strict'

angular.module('planning')
  .constant('ROUND_STATUS', {
    PLANNING: 'Planning',
    ROUTING_READY: 'Ready for Routing',
    ALLOCATING: 'Ready for Allocation',
    IN_PROGRESS: 'In Progress',
    READY: 'Ready',
    COMPLETE: 'Complete',
    CANCELLED: 'Cancelled',
    POSTPONED: 'Postponed'
  })
