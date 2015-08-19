/**
 * Map/reduce functions for the 'ccu_breakdown/by_date' view.
 *
 * N.B. the functions are not used directly in the app but saved in a view on CouchDB.
 */

var ccu_breakdown_by_date_map_reduce = {
  map: function (doc) {
    if (doc.facility && doc.created && doc.ccuProfile) {
      emit(new Date(doc.created), {
        facility: doc.facility.uuid || doc.facility,
        created: doc.created,
        ccuStatus: doc.ccuStatus,
        modified: doc.modified,
        ccuProfile: {
          dhis2_modelid: doc.ccuProfile.dhis2_modelid
        }
      });
    }
  },

  reduce: undefined
};
