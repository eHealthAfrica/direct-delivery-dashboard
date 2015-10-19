'use strict';

angular.module('lmisApp')
  .service('facilityCSV', function(utility, facilityReports) {
    var headers = [
      'Zone',
      'LGA',
      'Facility',
      'Reporting',
      'Count Date',
      'Report Date',
      'Days Since Last Count',
      'Contact Name',
      'Contact Phone',
      'Contact Email',
      'Working Phone'
    ];

    var filename = 'reporting-facilities';

    function formatSummaries(summaries) {
      return summaries.map(function(summary) {

        return {
          zone: summary.zone,
          lga: summary.lga,
          facility: summary.facility,
          reporting: !summary.isNonReporting,
          countDate: summary.lastCountDate,
          reportDate: summary.createdDate,
          daysSinceLastCount: summary.daysFromLastCountDate,
          contactName: summary.contact.name,
          contactPhone: summary.contact.phone,
          contactEmail: summary.contact.email,
          phoneStatus: summary.reportingStatus !== facilityReports.reportingConstants.FAULTY_PHONE
        };
      }).sort(function(a,b){
        return a.daysSinceLastCount - b.daysSinceLastCount;
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
