'use strict'

angular.module('locationServiceMock', [])
  .factory('locationLevels', function () {
    return [
      {
        "_id": "0",
        "_rev": "1-e24dba77d54ed4180a69b6d1ae08e35c",
        "doc_type": "location-level",
        "name": "Country",
        "level": 0,
        "parent": null
      },
      {
        "_id": "2",
        "_rev": "1-19f775ca010ff31863ab7e5c5287b131",
        "doc_type": "location-level",
        "name": "State",
        "level": 2,
        "parent": "1"
      },
      {
        "_id": "4",
        "_rev": "1-e0c680ed5a7a4b0a38c48ab256590cce",
        "doc_type": "location-level",
        "name": "LGA",
        "level": 4,
        "parent": "3"
      },
      {
        "_id": "6",
        "_rev": "1-b0f5cef2026b3c7d7f86dce008628bd3",
        "doc_type": "location-level",
        "name": "Facility",
        "level": 6,
        "parent": "5"
      }
    ]
  })
