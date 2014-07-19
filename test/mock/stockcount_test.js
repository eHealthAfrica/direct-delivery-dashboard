'use strict';

function recreateStockcountTestDB(cb) {
  PouchDB.destroy('stockcount_test', function (err) {
    if (!err) {
      var db = new PouchDB('stockcount_test');
      db.bulkDocs({ docs: stockcount_test_docs }, function (err) {
        if (!err)
          cb(db);
        else
          throw err;
      });
    }
    else
      throw err;
  });
}

var stockcount_test_docs = [
  {
    "_id": "02818bb8-e6e9-41af-cdae-acc8e1491c82",
    "_rev": "2-ddd5ce877736b4271201a8892d6cd0e4",
    "countDate": "2014-04-28T00:00:00.000Z",
    "created": "2014-04-28T10:23:12.719Z",
    "dateSynced": "2014-04-28T10:35:42.193Z",
    "facility": "a6ef2104-45bb-438c-80b8-21b4cb7d43bc",
    "isComplete": 1,
    "lastPosition": 0,
    "modified": "2014-04-28T10:35:42.201Z",
    "unopened": {
      "075bd789-4b29-4033-80b6-4f834e602628": 2,
      "87115282-6a35-42fb-ae2b-860e510b592f": 1,
      "abf5f2fc-056a-45cc-b7b7-553a09c927d7": 57,
      "dfe5b135-12b8-4da0-ad39-b54e864f5663": 67,
      "98a339168e96-42e2-4797-b6dd-cad886e9": 7,
      "8471294c0c04-3ac0-46c6-80c3-032404e3": 56
    },
    "uuid": "02818bb8-e6e9-41af-cdae-acc8e1491c82"
  },
  {
    "_id": "04873a9c-f899-4f95-f340-beb0e610b5ff",
    "_rev": "1-0c4dcf6a3afce98bb336e7bce4e58f4a",
    "countDate": "2014-04-10T00:00:00.000Z",
    "created": "2014-04-09T14:25:24.000Z",
    "facility": "d48a39fb-6d37-4472-9983-bc0720403719",
    "isComplete": 1,
    "lastPosition": 0,
    "modified": "2014-04-10T11:13:45.000Z",
    "unopened": {
      "075bd789-4b29-4033-80b6-4f834e602628": 122,
      "217e255d-0dd0-4bcf-aefc-3d7668ba7487": 20
    },
    "uuid": "04873a9c-f899-4f95-f340-beb0e610b5ff"
  },
  {
    "_id": "0756d8f3-6935-41c4-a902-dbb2f0059364",
    "_rev": "32-2871a9760bd796c67bbb628051e6bc13",
    "countDate": "2014-05-02T00:00:00.000Z",
    "created": "2014-05-02T13:41:58.649Z",
    "dateSynced": "2014-05-03T13:04:28.789Z",
    "facility": "a6ef2104-45bb-438c-80b8-21b4cb7d43bc",
    "isComplete": 1,
    "lastPosition": 0,
    "modified": "2014-05-03T13:04:27.803Z",
    "unopened": {
      "075bd789-4b29-4033-80b6-4f834e602628": 300,
      "87115282-6a35-42fb-ae2b-860e510b592f": 602,
      "abf5f2fc-056a-45cc-b7b7-553a09c927d7": 90,
      "dfe5b135-12b8-4da0-ad39-b54e864f5663": 99,
      "f97be2aa-d5b6-4560-8f31-5a559fb80567": 854
    },
    "uuid": "0756d8f3-6935-41c4-a902-dbb2f0059364"
  }
];
