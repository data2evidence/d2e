/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require(__base + "error");

describe("Gene Alteration Test", function() {

    beforeEach(initDefaultContext);

    afterEach(cleanUp);

    it("Get alteration matrix data set - missing parameter : reference", async function() {
        try {
            await context.getExtension('genetables.GeneAlteration.getAlterationMatrixData')({});
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['reference']);
        }
    });
    
    it("Get alteration matrix data - missing parameter : dataset", async function() {
        try {
            await context.getExtension('genetables.GeneAlteration.getAlterationMatrixData')({reference:"GRCh37"});
            expect(false).toBeTruthy();
        } catch (exception) {
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['dataset']);
        }
    });

});