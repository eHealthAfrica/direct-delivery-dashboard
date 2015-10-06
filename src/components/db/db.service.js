'use strict';

/**
 * @name storageService
 * @desc
 */
angular.module('db')
  .service('dbService', function(config, pouchDB) {

    var _this = this;
    var remoteDB = pouchDB(config.db);

    _this.addTimeInfo = function (doc) {
      var now = new Date().toJSON();
      if (!doc.createdOn) {
        doc.createdOn = now;
      }
      doc.modifiedOn = now;
      return doc;
    };

    /**
     * This does the following:
     * 1. Update an existing document.
     * 2. Insert a new document that has _id property.
     * 3. Insert a new document that does not have _id property and assign it an _id.
     *
     * @param {Object} doc - document to be saved.
     * @returns {$promise}
     */
    _this.save = function (doc) {
      doc = _this.addTimeInfo(doc);
      if (doc._id) {
        return _this.update(doc)
          .catch(function () {
            return remoteDB.put(doc, doc._id)
              .then(function (res) {
                doc._id = res.id;
                doc._rev = res.rev;
                return doc;
              });
          });
      } else {
        return _this.insert(doc);
      }
    };

    _this.get = function (id) {
      return remoteDB.get(id);
    };

    _this.delete = function (doc) {
      return remoteDB.get(doc._id)
          .then(function(doc){
            return remoteDB.remove(doc);
          });
    };

    /**
     * Used to save a new document without an _id property, Pouchdb or
     * underlying service should generate the _id.
     *
     * @param doc - a new document without an _id.
     * @returns {$promise}
     * @see http://pouchdb.com/api.html#create_document
     */
    _this.insert = function (doc) {
      doc = _this.addTimeInfo(doc);
      return remoteDB.post(doc)
        .then(function (res) {
          doc._id = res.id;
          doc._rev = res.rev;
          return doc;
        });
    };

    _this.insertWithId = function(doc, id){
      doc = _this.addTimeInfo(doc);
      return remoteDB.put(doc, id);
    };

    /**
     * Updates document only if it exists.
     *
     * @param doc - existing document with _id property.
     * @returns {$promise}
     */
    _this.update = function (doc) {
      doc = _this.addTimeInfo(doc);
      return remoteDB.get(doc._id)
        .then(function (res) {
            //TODO: investigate this this wont cause an overwrite i.e assigning doc._rev to res._rev;
          doc._rev = res._rev;
          return remoteDB.put(doc, doc._id)
            .then(function (res) {
              doc._id = res.id;
              doc._rev = res.rev;
              return doc;
            });
        });
    };

    _this.getView = function(view, options){
      return remoteDB.query(view, options);
    };

    _this.saveDocs = function(docs, options){
      var opt = { all_or_nothing: true };
      if(options){
        opt = options;
      }
      return remoteDB.bulkDocs(docs, opt);
    };

  });
