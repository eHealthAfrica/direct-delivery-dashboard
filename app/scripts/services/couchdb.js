'use strict';

angular.module('lmisApp')
  .factory('couchdb', function ($resource, SETTINGS) {
    return $resource(SETTINGS.dbUrl + ':_db/:_action/:_param/:_sub/:_sub_param', {},
      {
        allDocs: {
          method: 'GET',
          withCredentials: true,
          params: {
            _action: '_all_docs',
            include_docs: true
          }
        },
        view: {
          method: 'GET',
          withCredentials: true,
          params: {
            _action: '_design',
            _sub: '_view'
          }
        }
      })
  });