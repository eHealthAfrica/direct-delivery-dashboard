'use strict';

angular.module('lmisApp')
  .factory('couchdb', function ($resource, SETTINGS) {
    return $resource(SETTINGS.dbUrl + ':_db/:_action/:_param/:_sub/:_sub_param',
      {
        _db: '@_db'
      },
      {
        allDocs: {
          method: 'GET',
          withCredentials: true,
          params: {
            _action: '_all_docs',
            include_docs: true
          }
        },
        bulkDocs: {
          method: 'POST',
          withCredentials: true,
          params: {
            _action: '_bulk_docs'
          }
        },
        view: {
          method: 'GET',
          withCredentials: true,
          params: {
            _action: '_design',
            _sub: '_view'
          }
        },
        mapReduce: {
          method: 'POST',
          withCredentials: true,
          params: {
            _action: '_temp_view'
          }
        },
        createDB: {
          method: 'PUT',
          withCredentials: true
        },
        deleteDB: {
          method: 'DELETE',
          withCredentials: true
        },
        session: {
          method: 'GET',
          withCredentials: true,
          params: {
            _db: '_session'
          }
        },
        login: {
          method: 'POST',
          withCredentials: true,
          params: {
            _db: '_session'
          }
        },
        logout: {
          method: 'DELETE',
          withCredentials: true,
          params: {
            _db: '_session'
          }
        }
      })
  });