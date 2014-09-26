'use strict';

angular.module('lmisApp')
  .service('facilityCSV', function(utility) {
    var headers = [
      'Zone',
      'LGA',
      'Facility',
      'Reporting',
      'Report Date',
      'Contact Name',
      'Contact Phone',
      'Contact Email'
    ];

    var filename = 'reporting-facilities';

    function formatSummaries(summaries) {
      return summaries.map(function(summary) {
        return {
          zone: summary.zone,
          lga: summary.lga,
          facility: summary.facility,
          reporting: !summary.isNonReporting,
          reportDate: summary.lastCountDate,
          contactName: summary.contact.name,
          contactPhone: summary.contact.phone,
          contactEmail: summary.contact.email
        };
      });
    }

    function csv(summaries) {
      return {
        headers: headers,
        rows: formatSummaries(summaries),
        filename: utility.getFileName(filename)
      };
    }

    return csv;
  });
