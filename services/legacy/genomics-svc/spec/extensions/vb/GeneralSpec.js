/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, afterEach, xit, it, expect, spyOn*/

var error = require(__base + "error");
let general = require(__base + "extensions/vb/General");

async function insertVBConfiguration(context, oConfig, sApplication, iRank) {
    var sQuery = 'INSERT INTO "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" ("User", "Created", "LastUpdated", "Configuration", "Application", "Rank") VALUES( null, CURRENT_UTCTIMESTAMP, CURRENT_UTCTIMESTAMP, ?, ?, ?)';
    return await context.connection.executeUpdate(sQuery, oConfig, sApplication, iRank);
}

async function insertVBConfigWithUserName(context, oConfig, sApplication, iRank) {
    var sQuery = 'INSERT INTO "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" ("User", "Created", "LastUpdated", "Configuration", "Application", "Rank") VALUES( SESSION_CONTEXT(\'XS_APPLICATIONUSER\'), CURRENT_UTCTIMESTAMP, CURRENT_UTCTIMESTAMP, ?, ?, ?)';
    return await context.connection.executeUpdate(sQuery, oConfig, sApplication, iRank);
}

describe("General", function () {

    beforeEach(initDefaultContext);

    afterEach(cleanUp);
    
    it("Get Genome Reference - missing parameter : dataset", async function () {
        try {
            await context.getExtension(general.getGenomeReference)();
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['dataset']);
        }
    }); 

    it("Get Genome Reference - 1 sample", async function () {
        var expectedResult = { reference: "GRCh37" };
        var result = await context.getExtension(general.getGenomeReference)({ dataset: "sample:9000010" });
        expect(result).toEqual(expectedResult);
    });
    
    it("Get Genome Reference - 2 sample", async function () {
        var expectedResult = { reference: "GRCh37" };
        var result = await context.getExtension(general.getGenomeReference)({ dataset: "sample:9000010, 31000514" });
        expect(result).toEqual(expectedResult);
    });

    it("Get Genome Reference - reference mismatch", async function () {
        try {
            await context.getExtension(general.getGenomeReference)({ dataset: "sample:9000010", reference: "GRCh38" });
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.ReferenceGenomeMismatch");
            expect(exception.parameters).toEqual(['GRCh38', 'GRCh37']);
        }
    });

    it("Get Chromosomes - invalid reference", async function () {
        try {
            await context.getExtension("vb.General.getChromosomes")({ reference: "xyz" });
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.NoReferenceChromosome");
            expect(exception.parameters).toEqual(['xyz']);
        }
    });

    it("Get Chromosomes", async function () {
        var result = await context.getExtension("vb.General.getChromosomes")({ reference: "GRCh37" });
        expect(result.list.length).toEqual(24);
    });

    it("Get browser configuration - Empty dataset", async function () {
        var result = await context.getExtension("vb.General.getBrowserConfiguration")({ "application": "test", "config": "trackConfig" });
        expect(result).toEqual({});
    });

    it("Get browser configuration - Empty dataset with application NULL", async function () {
        var result = await context.getExtension("vb.General.getBrowserConfiguration")({ "application": "", "config": "trackConfig" });
        expect(result).toEqual({});
    });

    /*it("Get browser configuration - null user - track config", async function(){
        await insertVBConfiguration( context, '{ "trackConfig": {}, "groupConfig": [] }', 'VB', 4 );
        await insertVBConfiguration( context, '{ "trackConfig": { "config": "tracks" }, "groupConfig": [ {}] }', 'test', 8 );
        var result = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application":"test","config":"trackConfig" } );
        expect( result ).toEqual( { config : 'tracks' } );
    });
    
    it("Get browser configuration - null application - group config", async function(){
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 4 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { "config": "tracks" }, "groupConfig": [ {} ] }', 'vb2', 8 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": {}, "groupConfig": [ { "grouping":"config" } ] }', '', 7 );
        var result = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application": '', "config":"groupConfig" } );
        expect( result ).toEqual( [ {"grouping":"config"} ] );
    });
    
    it("Get browser configuration - track config", async function(){
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 2 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { "config": "tracks" }, "groupConfig": [ { "type" : "40"} ] }', 'vb2', 3 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": {}, "groupConfig": [ {"grouping":"config" } ] }', null, 4 );
        var result = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application": 'vb2', "config":"groupConfig" } );
        expect( result ).toEqual( [ {"grouping":"config" } ] );
    });
    
    it("Get browser configuration - track config higher rank", async function(){
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 2 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { "config": "tracks" }, "groupConfig": [ { "type" : "40"} ] }', 'vb2', 5 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": {}, "groupConfig": [ {"grouping":"config" } ] }', null, 3 );
        var result = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application": 'vb2', "config":"groupConfig" } );
        expect( result ).toEqual( [ { "type" : "40"} ] );
    });
    
    it("Upsert browser configuration - group config update existing config", async function(){
        await insertVBConfiguration( context, '{ "trackConfig": {}, "groupConfig": [] }', 'VB', 10 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 0 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { "config": "tracks" }, "groupConfig": [ { "type" : "40"} ] }', 'vb2',100 );
        await context.getExtension( "vb.General.upsertBrowserConfiguration" )( {"application":"vb2","config":"groupConfig","browserConfiguration":{"upsert":"successful"}} );
        var oGroupConfig = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application": 'vb2', "config":"groupConfig" } );
        var oTrackConfig = await context.getExtension( "vb.General.getBrowserConfiguration" )( { "application": 'vb2', "config":"trackConfig" } );
        expect( oGroupConfig ).toEqual( {"upsert":"successful"} );
        expect( oTrackConfig ).toEqual( {"config":"tracks"} );
    });
    
    it("Upsert browser configuration - group config with new entry to session user", async function(){
        await insertVBConfiguration( context, '{ "trackConfig": {}, "groupConfig": [] }', 'VB', 3 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 5 );
        await context.getExtension( "vb.General.upsertBrowserConfiguration" )( {"application":"vb2","config":"groupConfig","browserConfiguration":{"upsert":"successful"}} );
        var sQuery = 'SELECT "Configuration" FROM "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" WHERE "User" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') AND "Application" = \'vb2\' ';
        var resultSet = await context.executeQuery( sQuery );
        expect( JSON.parse(  resultSet[ 0 ].Configuration ) ).toEqual( {"groupConfig":{"upsert":"successful"}} );
    });
    
    it("Upsert browser configuration - group config ", async function(){
        await insertVBConfiguration( context, '{ "trackConfig": {}, "groupConfig": [] }', 'VB', 3 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { }, "groupConfig": [ ] }', 'VB', 4 );
        await insertVBConfigWithUserName( context, '{ "trackConfig": { "config": "tracks" } }', 'vb2', 100 );
        await context.getExtension( "vb.General.upsertBrowserConfiguration" )( {"application":"vb2","config":"groupConfig","browserConfiguration":{"upsert":"successful"}} );
        var sQuery = 'SELECT "Configuration" FROM "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" WHERE "User" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') AND "Application" = \'vb2\' ';
        var resultSet = await context.executeQuery( sQuery );
        expect( JSON.parse( resultSet[ 0 ].Configuration) ).toEqual( {"trackConfig":{"config":"tracks"},"groupConfig":{"upsert":"successful"}} );
    });*/
});
