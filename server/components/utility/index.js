'use strict';

exports.removeDesignDocs = function removeDesignDocs(docs) {
  if (!docs || !docs.length)
    return docs;

  return docs.filter(function(doc) {
    return doc && doc._id && doc._id.substr(0, 7) !== '_design';
  });
};
