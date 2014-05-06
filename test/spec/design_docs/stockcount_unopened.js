'use strict';

describe('Stockcount Unopened View', function () {
  var db = null;

  beforeEach(function (done) {
    recreateStockcountTestDB(function (d) {
      db = d;
      done();
    });
  });

  it('should generate the correct data', function (done) {
    db.query(stockcount_unopened_map_reduce, { reduce: true, group: true }, function (err, response) {
      expect(err).toBeNull();
      expect(response.rows.length).toEqual(results.keys.length);

      for (var i = 0; i < results.keys.length; i++) {
        var row = response.rows[i];
        expect(JSON.stringify(row.key)).toEqual(JSON.stringify(results.keys[i]));
        expect(row.value).toEqual(results.values[i]);
      }

      done();
    });
  });

  var results = {
    keys: [
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "075bd789-4b29-4033-80b6-4f834e602628", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "075bd789-4b29-4033-80b6-4f834e602628", "2014-05-02T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "8471294c0c04-3ac0-46c6-80c3-032404e3", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "87115282-6a35-42fb-ae2b-860e510b592f", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "87115282-6a35-42fb-ae2b-860e510b592f", "2014-05-02T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "98a339168e96-42e2-4797-b6dd-cad886e9", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "abf5f2fc-056a-45cc-b7b7-553a09c927d7", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "abf5f2fc-056a-45cc-b7b7-553a09c927d7", "2014-05-02T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "dfe5b135-12b8-4da0-ad39-b54e864f5663", "2014-04-28T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "dfe5b135-12b8-4da0-ad39-b54e864f5663", "2014-05-02T00:00:00.000Z"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "f97be2aa-d5b6-4560-8f31-5a559fb80567", "2014-05-02T00:00:00.000Z"],
      ["d48a39fb-6d37-4472-9983-bc0720403719", "075bd789-4b29-4033-80b6-4f834e602628", "2014-04-10T00:00:00.000Z"],
      ["d48a39fb-6d37-4472-9983-bc0720403719", "217e255d-0dd0-4bcf-aefc-3d7668ba7487", "2014-04-10T00:00:00.000Z"]
    ],
    values: [ 2, 300, 56, 1, 602, 7, 57, 90, 67, 99, 854, 122, 20 ]
  };
});
