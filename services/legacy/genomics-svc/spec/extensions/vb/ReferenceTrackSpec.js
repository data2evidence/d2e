/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require(__base + "error");

async function insertReferenceTrackFeatures(context, data) {
    var length = data.ReferenceID.length;
    for (var i = 0; i < length; i++) {
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::Reference.Sequences\" (\"ReferenceID\", \"ChromosomeIndex\", \"Region.Begin\", \"Region.End\", \"Sequence\" ) values ( ?, ?, ?, ?, ? )",
            data.ReferenceID[i], data.ChromosomeIndex[i], data.Begin[i], data.End[i], data.Sequence[i]
        )).toBe(1);
    }
}

describe("ReferenceTrack", function () {

    beforeEach(async function () {
        await initDefaultContext();

        var SNVReReferenceData = {
            ReferenceID: ["RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1", "RTest1"],
            ChromosomeIndex: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            Begin: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            End: [9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 109],
            Sequence: ["0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789", "0123456789"]
        };
        await insertReferenceTrackFeatures(context, SNVReReferenceData);
    });

    afterEach(async function () {
        await context.connection.rollback();
        await context.close();
        context = null;
    });

    it("Get Reference ID - missing parameter : reference", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({});
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['reference']);
        }
    });

    it("Get chromosomeIndex - missing parameter : chromosomeIndex", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1" });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['chrom']);
        }
    });

    it("Get chromosomeIndex - invalid parameter : chromosome < 0", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": -1 });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['chrom']);
        }
    });

    it("Get begin - missing parameter : begin", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30 });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['begin']);
        }
    });

    it("Get begin - invalid parameter : begin < 0", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": -1 });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['begin']);
        }

    });

    it("Get begin - missing parameter : end", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 0 });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['end']);
        }

    });

    it("Get begin - invalid parameter : end < 0", async function () {
        try {
            await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 0, "end": -1 });
            expect(false).toBeTruthy();
        }
        catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['end']);
        }
    });


    it("Return of Feature Parameter if R.B=begin and R.E = End: Features", async function () {

        var expectedfeatures = { sequence: '01234567890123', begin: 0, size: 14 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 0, "end": 14 });

        expect(expectedfeatures).toEqual(oFeatures);
    });

    it("Return of Feature Parameter if R.B=begin and R.E < End: Features", async function () {

        var expectedfeatures = { sequence: '0123456789', begin: 100, size: 10 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 100, "end": 120 });

        expect(expectedfeatures).toEqual(oFeatures);
    });


    it("Return of Feature Parameter if R.B=begin and R.E > End: Features", async function () {

        var expectedfeatures = { sequence: '1234567', begin: 1, size: 7 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 1, "end": 8 });

        expect(expectedfeatures).toEqual(oFeatures);
    });

    it("Return of Feature Parameter if R.B>begin and R.E > End: Features", async function () {

        var expectedfeatures = { sequence: '', begin: 120, size: 0 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 120, "end": 130 });

        expect(expectedfeatures).toEqual(oFeatures);
    });

    it("Return of Feature Parameter if R.B mid begin and R.E mid End: Features", async function () {

        var expectedfeatures = { sequence: '4567', begin: 44, size: 4 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 44, "end": 48 });

        expect(expectedfeatures).toEqual(oFeatures);
    });

    it("Return of Feature Parameter  R.B out of boundry range: Features", async function () {

        var expectedfeatures = { sequence: '', begin: 110, size: 0 };
        var oFeatures = await context.getExtension("vb.ReferenceTrack.fullReload")({ "reference": "RTest1", "chrom": 30, "begin": 110, "end": 115 });

        expect(expectedfeatures).toEqual(oFeatures);
    });
});
