/* global beforeOnce, beforeEach, afterOnce, afterEach, describe, it, xit */

var error = require(__base + 'error');
var hgvsNotation = require(__base + 'hgvsNotation');
var MockData = require('./MockData');

async function insertDummyData(context) {
    var oObj = {},
        oEntry = {};
    var oMockData = MockData.getTestData();

    for (i = 0; i < oMockData.length; i++) {
        oObj = oMockData[i].result;
        oEntry = oObj.alleles[0];

        await context.connection.executeUpdate(
            'INSERT INTO "hc.hph.genomics.db.models::SNV.Genotypes" ("DWAuditID", "VariantIndex", "SampleIndex", "Phased", "ReferenceAlleleCount", "CopyNumber") values (?,?,?,?,?,?)', -
            100, oEntry.VariantIndex, 99999, 0, 1, 2
        );

        await context.connection.executeUpdate(
            'INSERT INTO "hc.hph.genomics.db.models::SNV.VariantAlleles" ("DWAuditID", "VariantIndex", "AlleleIndex", "Allele") VALUES (?,?,?,?)', -
            100, oEntry.VariantIndex, 0, oEntry['Allele.Reference']
        );

        await context.connection.executeUpdate(
            'INSERT INTO "hc.hph.genomics.db.models::SNV.VariantAlleles" ("DWAuditID", "VariantIndex", "AlleleIndex", "Allele") VALUES (?,?,?,?)', -
            100, oEntry.VariantIndex, 1, oEntry['Allele.Alternative']
        );

        await context.connection.executeUpdate(
            'INSERT INTO "hc.hph.genomics.db.models::SNV.VariantAnnotations" ("DWAuditID", "VariantIndex", "AlleleIndex", "ChromosomeIndex", "Position", "GeneName", "Region", "SequenceAlteration", "AminoAcid.Reference", "AminoAcid.Alternative", "MutationType", "CDSPosition", "Transcript", "Protein", "RunAuditID") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
            -100, oEntry.VariantIndex, 1, oObj.ChromosomeIndex, oObj.Position, oEntry.GeneName, oEntry.Region, oEntry.SequenceAlteration, oEntry["AminoAcid1.Reference"], oEntry["AminoAcid1.Alternative"], oEntry.MutationType, oEntry.CDSPosition, oEntry.Transcript, oEntry.Protein, -100
        );

        var vIDList = oEntry.VariantIdList[0].VariantID.split(",");
        for(var j = 0 ; j < vIDList.length ; j++ ){
            await context.connection.executeUpdate(
                'INSERT INTO "hc.hph.genomics.db.models::SNV.VariantIDs" ("DWAuditID", "VariantIndex", "VariantID") VALUES (?,?,?)', -
                100, oEntry.VariantIndex,vIDList[j]);
        }

    }

}

describe("Test the HGVS Generation Service", function() {

    var hgvsGenerator = null;

    beforeEach(async function() {
        await initDefaultContext();
        hgvsGenerator = new hgvsNotation.Generator(context);
        await insertDummyData(context);
        this.counter = 0;
    });

    afterEach(cleanUp);

    var oMockData = MockData.getTestData();
    
    var oObj1 = {};
     oObj1 = oMockData[0].result;
    
    
    it("Checks the correctness of input line 1", async function() {

        var data = await hgvsGenerator.getVariantDetails({
            "sampleIdx": 99999,
            "chrom": oObj1.ChromosomeIndex,
            "position": oObj1.Position,
            "reference": oObj1.Reference
            });
        expect(data).not.toBe(null);
    });
    
    
    it("non-existant chromosome index", async function() {
        var emptyObj={};
        var data = await hgvsGenerator.getVariantDetails({
            "sampleIdx": 99999,
            "chrom": 200,
             "position": oObj1.Position,
            "reference": oObj1.Reference
            });
            expect(Object.keys(data).length).toBe(Object.keys(emptyObj).length);
    });
    
    
    it("Invalid chromosome index", async function() {
        try {
            await hgvsGenerator.getVariantDetails({
                "sampleIdx": 99999,
                "chrom": -2,
                 "position": oObj1.Position,
                "reference": oObj1.Reference
                });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['chrom']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });
    
    it("non-existant sample index check", async function() {
        var aSamples=[123456789];
        try {
            await hgvsGenerator.getDWAuditID(aSamples);
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.Internal');
            expect(exception.message).toEqual('Invalid sample index.');
        }
    });
    
    var i = 0 ;
    it( oMockData[i].testCase, async function() {
        var data = JSON.stringify(await hgvsGenerator.getVariantDetails({
            "sampleIdx": [99999],
            "chrom":oMockData[i].result.ChromosomeIndex ,
            "position": oMockData[i].result.Position,
            "reference": oMockData[i].result.Reference
        }));
        expect(data).toBe(JSON.stringify(oMockData[i].result));
    });
    i++;
    it( oMockData[i].testCase, async function() {
        var data = JSON.stringify(await hgvsGenerator.getVariantDetails({
            "sampleIdx": [99999],
            "chrom":oMockData[i].result.ChromosomeIndex ,
            "position": oMockData[i].result.Position,
            "reference": oMockData[i].result.Reference
        }));
        expect(data).toBe(JSON.stringify(oMockData[i].result));
    });
    i++;
    
    it( oMockData[i].testCase, async function() {
        var data = JSON.stringify(await hgvsGenerator.getVariantDetails({
            "sampleIdx": [99999],
            "chrom":oMockData[i].result.ChromosomeIndex ,
            "position": oMockData[i].result.Position,
            "reference": oMockData[i].result.Reference
        }));
        expect(data).toBe(JSON.stringify(oMockData[i].result));
    });
    
    
    
    /*for (var i = 0; i < oMockData.length; i++) {
    var oObj2 = {};
     oObj2 = oMockData[i].result;
    this.counter = i;
    it( oMockData[i].testCase , function() {
        var data = JSON.stringify(hgvsGenerator.getVariantDetails({
            "sampleIdx": [99999],
            "chrom":oMockData[this.counter].result.ChromosomeIndex ,
            "position": oMockData[this.counter].result.Position,
            "reference": oMockData[this.counter].result.Reference
        }));
        expect(data).toBe(JSON.stringify(oMockData[this.counter].result));
        this.counter ++;
    });
  this.counter = 0;
}
  */

});