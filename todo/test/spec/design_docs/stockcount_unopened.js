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
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "075bd789-4b29-4033-80b6-4f834e602628"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "8471294c0c04-3ac0-46c6-80c3-032404e3"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "87115282-6a35-42fb-ae2b-860e510b592f"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "98a339168e96-42e2-4797-b6dd-cad886e9"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "abf5f2fc-056a-45cc-b7b7-553a09c927d7"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-04-28T00:00:00.000Z", "dfe5b135-12b8-4da0-ad39-b54e864f5663"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-05-02T00:00:00.000Z", "075bd789-4b29-4033-80b6-4f834e602628"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-05-02T00:00:00.000Z", "87115282-6a35-42fb-ae2b-860e510b592f"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-05-02T00:00:00.000Z", "abf5f2fc-056a-45cc-b7b7-553a09c927d7"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-05-02T00:00:00.000Z", "dfe5b135-12b8-4da0-ad39-b54e864f5663"],
      ["a6ef2104-45bb-438c-80b8-21b4cb7d43bc", "2014-05-02T00:00:00.000Z", "f97be2aa-d5b6-4560-8f31-5a559fb80567"],
      ["d48a39fb-6d37-4472-9983-bc0720403719", "2014-04-09T00:00:00.000Z", "075bd789-4b29-4033-80b6-4f834e602628"],
      ["d48a39fb-6d37-4472-9983-bc0720403719", "2014-04-09T00:00:00.000Z", "217e255d-0dd0-4bcf-aefc-3d7668ba7487"]
    ],
    values: [ 2, 56, 1, 7, 57, 67, 300, 602, 90, 99, 854, 122, 20 ]
  };
});
