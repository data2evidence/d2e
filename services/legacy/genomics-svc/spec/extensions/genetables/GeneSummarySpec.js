/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require(__base + "error");

describe("Gene Summary Test", function() {
    
    beforeEach(initDefaultContext);

    afterEach(cleanUp);
    
    it("Get Gene Summary data - missing parameter : reference", async function(){
        try{
            await context.getExtension('genetables.GeneSummary.getGeneSummaryData')( {} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['reference']);
        }
    });
    
    it("Get Gene Summary data - missing parameter : dataset", async function(){
        try{
            await context.getExtension('genetables.GeneSummary.getGeneSummaryData')( {reference:"GRCh37"} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect(exception).toEqual(jasmine.any(error.BioInfError));
            expect(exception.errorCode).toBe("error.MissingRequestParameter");
            expect(exception.parameters).toEqual(['dataset']);
        }
    });
    
});