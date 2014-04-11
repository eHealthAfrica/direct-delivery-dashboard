'use strict';
describe('Database service', function() {
    var httpBackend, database;

    beforeEach(module('lmisDashboardApp'));

    beforeEach(inject(function($injector) {
        httpBackend = $injector.get('$httpBackend');
        database = $injector.get('database');
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should be able to retrieve all documents from the database', function() {
        var responseMock = {rows:{
            doc1:{},
            doc2:{},
            doc3:{}
        }}
        httpBackend.expectGET('http://dev.lomis.ehealth.org.ng:5984/stockcount/_all_docs?include_docs=true').respond(200, responseMock);
        database.loadData()
        httpBackend.flush();
    });

});