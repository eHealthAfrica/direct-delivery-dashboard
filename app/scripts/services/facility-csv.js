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
        summary.contactName = summary.contact.name;
        summary.contactPhone = summary.contact.phone;
        summary.contactEmail = summary.contact.email;
        delete summary.contact;
        return summary;
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
