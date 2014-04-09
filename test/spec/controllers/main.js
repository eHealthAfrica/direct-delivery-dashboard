'use strict';

describe('Main controller', function() {

    var rootScope, scope, controller, database;

    beforeEach(module('lmisDashboardApp'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _database_) {
        rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        database = _database_;
        controller = _$controller_('main', {$scope:scope, database:_database_});
    }));

    it('should be able to load all documents to display in the table using Database service', function() {
        spyOn(database, 'loadData').andCallThrough();
        scope.init();
        expect(database.loadData).toHaveBeenCalled();
    });


});