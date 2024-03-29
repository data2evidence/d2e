/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

var error = require(__base + 'error');
var SiteTracks = require(__base + 'extensions/vb/SiteTracks');

async function insertFeatures(context, data) {
    var length = data.DWAuditID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::Reference.Features\" ( \"DWAuditID\",\"ReferenceID\", \"ChromosomeIndex\", \"Region.Begin\", \"Region.End\", \"FeatureID\", \"Class\", \"FeatureName\", \"Strand\", \"Frame\", \"Score\", \"ParentID\", \"Description\", \"FileChromosomeName\" ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
            data.DWAuditID[i], data.ReferenceID[i], data.ChromosomeIndex[i], data.Begin[i], data.End[i], data.FeatureID[i], data.Class[i], data.FeatureName[i], data.Strand[i], data.Score[i], data.Frame[i], data.ParentID[i], data.Description[i], data.FileChromosomeName[i]
        )).toBe(1);
    }
}

async function insertReferenceAlleles(context, data) {
    var length = data.ReferenceID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::Reference.Sequences\" ( \"ReferenceID\", \"ChromosomeIndex\", \"Region.Begin\", \"Region.End\", \"Sequence\") values ( ?, ?, ?, ?,? )",
            data.ReferenceID[i], data.ChromosomeIndex[i], data.Begin[i], data.Begin[i] + data.Sequence[i].length, data.Sequence[i]
        )).toBe(1);
    }
}

async function insertAlleleFrequencies(context, data) {
    var length = data.DWAuditID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::SNV.VariantAlleles\" ( \"DWAuditID\", \"VariantIndex\", \"AlleleIndex\", \"Allele\") values ( ?, ?, ?, ? )",
            data.DWAuditID[i], data.VariantIndex[i], data.AlleleIndex[i], data.Allele[i]
        )).toBe(1);
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::SNV.GenotypeAlleles\" ( \"DWAuditID\", \"VariantIndex\", \"SampleIndex\", \"AlleleIndex\", \"AlleleCount\") values ( ?, ?, ?, ?, ? )",
            data.DWAuditID[i], data.VariantIndex[i], data.SampleIndex[i], data.AlleleIndex[i], data.AlleleCount[i]
        )).toBe(1);
    }
}

async function insertSNVVariants(context, data) {
    var length = data.DWAuditID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::SNV.Variants\" ( \"DWAuditID\", \"VariantIndex\", \"ChromosomeIndex\", \"Position\", \"VariantID\", \"Quality\" ) values ( ?, ?, ?, ?, ?, ? )",
            data.DWAuditID[i], data.VariantIndex[i], data.ChromosomeIndex[i], data.Position[i], data.VariantID[i], data.Quality[i]
        )).toBe(1)
    }
}

async function insertSNVGenotypes(context, data) {
    var length = data.DWAuditID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::SNV.Genotypes\" ( \"DWAuditID\", \"VariantIndex\", \"SampleIndex\", \"Phased\", \"ReferenceAlleleCount\", \"CopyNumber\" ) values ( ?, ?, ?, ?, ?, ? )",
            data.DWAuditID[i], data.VariantIndex[i], data.SampleIndex[i], data.Phased[i], data.ReferenceAlleleCount[i], data.CopyNumber[i]
        )).toBe(1);
    }
}

describe("SiteTrack", function () {

    beforeEach(async function () {
        await initDefaultContext();

        var ReferenceAllele = {
            ReferenceID: ["GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37"],
            ChromosomeIndex: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            Begin: [0, 11, 21, 31, 41, 51, 61, 71, 81, 91, 100],
            Sequence: ["0123457691", "5678902475", "2345798752", "2389752897", "7648315491", "8627986483", "8974635814", "8974312795", "8792467984", "8794527914", "8726941537"]
        };
        await insertReferenceAlleles(context, ReferenceAllele);

        var FeaturesData = {
            DWAuditID: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
            ReferenceID: ["GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37"],
            ChromosomeIndex: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            Begin: [10, 140, 30, 130, 180, 220, 230, 250, 340, 390, 400],
            End: [120, 180, 80, 180, 220, 260, 280, 310, 400, 470, 490],
            FeatureID: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"],
            Class: ["gene", "cytoband", "mRNA", "gene", "cytoband", "mRNA", "gene", "cytoband", "mRNA", "gene", "cytoband", "mRNA"],
            FeatureName: ["WDR65", "p34.2", "NM_001195831.2", "WDR65", "p34.2", "NM_001195831.2", "WDR65", "p34.2", "NM_001195831.2", "WDR65", "p34.2", "NM_001195831.2"],
            Strand: ["+", "+", "+", "-", "+", "-", "+", "+", "+", "+"],
            Frame: [null, null, null, null, null, null, null, null, null, null, null, null],
            Score: [1.3, 2.3, 35, 3.4, 5.2, 43, 2, 55, 6, 2, 5],
            ParentID: ["ma3", "ma4", "ied", "dwe", "sfd", "wer", "loc", "locd3", "loc39", "loc90"],
            Description: ["WD repeat domain 65", null, null, null, null, null, null, null, null, null, null],
            FileChromosomeName: ["name1", "name2", "eewe", "ied", "dwe", "sfd", "wer", "ojo", "opo2", "i9w", "wer", "ojo", "opo2", "i9w"]
        };
        await insertFeatures(context, FeaturesData);

        var AlleleFrequency = {
            DWAuditID: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
            ChromosomeIndex: [30, 30, 30, 30, 30, 30, 30],
            VariantIndex: [257, 234, 343, 347, 348, 343, 343, 344, 345, 346],
            SampleIndex: [0, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1],
            AlleleIndex: [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            AlleleCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            Allele: ["A", "C", "T", "G", "A", "G", "T", "A", "C", "G", "T", "C", "A"],
        };
        await insertAlleleFrequencies(context, AlleleFrequency);

        var SNVGenotypesData = {
            DWAuditID: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
            VariantIndex: [257, 234, 343, 347, 348, 343, 343, 344, 345, 346],
            SampleIndex: [0, 1, 0, 0, 0, 1, 2, 1, 1, 1, 1],
            Phased: [1, 0, 2, 1, 0, 2, 3, 1, 0, 1, 1],
            ReferenceAlleleCount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            CopyNumber: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        };
        await insertSNVGenotypes(context, SNVGenotypesData);

        var SNVVariantsData = {
            DWAuditID: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
            VariantIndex: [257, 234, 343, 347, 348, 343, 343, 344, 345, 346],
            ChromosomeIndex: [30, 31, 30, 31, 30, 30, 30, 30, 30, 30, 30],
            Position: [100, 150, 150, 100, 200, 250, 300, 350, 400, 450, 500],
            VariantID: ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11"],
            Quality: [1.3, 2.3, 35, 3.4, 5.2, 43, 2, 55, 6, 2, 5]
        };
        await insertSNVVariants(context, SNVVariantsData);
    });

    afterEach(cleanUp);

    it("loadFeatures-missing parameter:reference", async function () {
        try {
            await SiteTracks.loadFeatures(context, {});
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['reference']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadFeatures- missing parameter: chromosomeIndex undefined", async function () {
        try {
            await SiteTracks.loadFeatures(context, { "reference": "GRCh37" });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['chrom']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadFeatures- missing parameter: position undefined ", async function () {
        try {
            await SiteTracks.loadFeatures(context, { "reference": "GRCh37", "chrom": 30 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['position']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadFeatures- No features", async function () {
        var expectedFeatures = {};
        var oFeatures = await SiteTracks.loadFeatures(context, { "reference": "GRCh37", "chrom": 31, "position": 1000000000 });
        expect(oFeatures).toEqual(expectedFeatures);
    });

    it("loadReferenceAllele - missing parameter : reference", async function () {
        try {
            await SiteTracks.loadReferenceAllele(context, {});
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['reference']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadReferenceAllele - missing parameter: chromosomeIndex undefined", async function () {
        try {
            await SiteTracks.loadReferenceAllele(context, { "reference": "GRCh37" });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['chrom']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadReferenceAllele- missing parameter: position undefined", async function () {
        try {
            await SiteTracks.loadReferenceAllele(context, { "reference": "GRCh37", "chrom": 30 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['position']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadReferenceAllele- label sequence: resultSet = 1", async function () {
        var referenceAllele = await SiteTracks.loadReferenceAllele(context, { "reference": "GRCh37", "chrom": 30, "position": 8 });
        var expectedAllele = { label: "9", value: 1 };
        expect(referenceAllele).toEqual(expectedAllele);
    });

    it("loadReferenceAllele- label sequence: resultset = 0", async function () {
        try {
            await SiteTracks.loadReferenceAllele(context, { "reference": "GRCh37", "chrom": 30, "position": 10 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.CouldNotDetermine'); // .because( "we could not find any reference allele at the given position" );
            expect(exception.parameters).toEqual(['reference allele']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadReferenceAllele- label sequence: reference allele ambiguous", async function () {
        try {
            await SiteTracks.loadReferenceAllele(context, { "reference": "GRCh37", "chrom": 30, "position": 100 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.Ambiguous'); // .because( "we found multiple reference alleles at the given position" );
            expect(exception.parameters).toEqual(['reference allele']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadAlleleFrequencies - missing parameter : chromosomeIndex undefined", async function () {
        try {
            await SiteTracks.loadAlleleFrequencies(context, { "reference": "GRCh37" });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['chrom']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadAlleleFrequencies- missing parameter: position undefined ", async function () {
        try {
            await SiteTracks.loadAlleleFrequencies(context, { "reference": "GRCh37", "chrom": 30 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['position']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadAlleleFrequencies - missing parameter : dataset", async function () {
        try {
            await SiteTracks.loadAlleleFrequencies(context, { "reference": "GRCh37", "chrom": 30, "position": 8 });
            expect(true).toBe(false); // .because( "we should have failed with an error" );
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
            expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
            expect(exception.parameters).toEqual(['dataset']); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
        }
    });

    it("loadAlleleFrequencies", async function () {
        var expectedAllele = [{ label: "9", value: 1 }];
        var AlleleFrequency = await SiteTracks.loadAlleleFrequencies(context, { "reference": "GRCh37", "chrom": 30, "position": 8, "dataset": "sample:0,1,2" });
        expect(AlleleFrequency).toEqual(expectedAllele);
    });
});
