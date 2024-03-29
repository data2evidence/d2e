/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );
let QualitativeTrack = require( __base + 'extensions/vb/QualitativeTrack');

describe("qualitativeTrack", function(){
    
    beforeEach(initDefaultContext);
    
    afterEach(cleanUp);
    
    it("Get qualitative data - missing parameter : reference", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, {} );    
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get qualitative data - invalid parameter : chromosome is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });
    
    it("Get qualitative data - invalid parameter : chromosome < 0", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });
    
    it("Get qualitative data - invalid parameter : begin", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', undefined ] );
        }
    });
    
    it("Get qualitative data - invalid parameter : begin is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": "x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', "x" ] );
        }
    });
    
    it("Get qualitative data - invalid parameter : begin < 0", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', -1 ] );
        }
    });
    
    it("Get qualitative data - missing parameter : end", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', undefined  ] );
        }
    });
    
    it("Get qualitative data - missing parameter : end is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243, "end": "x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', "x"  ] );
        }
    });
    
    it("Get qualitative data - missing parameter : end is -1", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243, "end": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', -1  ] );
        }
    });
	
	 it("Get qualitative data - missing parameter : dataset", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243, "end": 56821 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset' ] );
        }
    });
	
	it("Get qualitative data - invalid parameter : binSize", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243, "end": 56821, "dataset": "sample:0,2" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', undefined ] );
        }
    });
    
	it("Get qualitative data - invalid parameter : binSize is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 43243, "end": 56821, "dataset": "sample:0,2", "binSize": "d" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', 'd'] );
        }
    });
    
    it("Get qualitative data - invalid parameter : binSize < 0", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 5, "begin": 19806460, "end": 19810671, "dataset": "sample:0,2", "binSize": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', -1 ] );
        }
    });
    
    it("Get qualitative data - with empty configuration", async function(){
        var expectedResult = { qualitativeData : [ { binIndex : 0, begin : 44074009, end : 44074009, fraction : 1,
                mutationData : [ { type : null, percent : 1 } ] } ], binSize : 10000000, begin : 44074000 };
        var result = await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 21, "begin": 44074000, "end": 44074019, "dataset": "sample:9000881", "binSize": 10000000 } );
        expect( result ).toEqual( expectedResult );
    });
    
    /*it("Get qualitative data", async function(){
        var expectedResult = { qualitativeData : [ { binIndex : 0, begin : 44074009, end : 44074009, fraction : 1,
                mutationData : [ { type : 0, percent : 0.5 }, { type : 1, percent : 0.5 } ] } ], binSize : 10000000, begin : 44074000 };
        var result = await QualitativeTrack.getQualitativeData( context, { "reference": "GRCh37", "chrom": 21, "begin": 44074000, "end": 44074019, "dataset": "sample:9000881", "binSize": 10000000,
                "annotationConfig":[ {"table":"VariantAnnotations","attribute":"MutationType","categories":[ {"values":["3_prime_UTR_variant","5_prime_UTR_variant","intergenic_variant","intron_variant","start_lost","stop_gained","stop_lost","stop_retained_variant","synonymous_variant","null"]},{"values":["missense_variant","splice_donor_variant","splice_acceptor_variant"] } ] } ] } );
        expect( result ).toEqual( expectedResult );
    });
    */
     it("Get qualitative site track - missing parameter : reference", async function(){
        try{
            await QualitativeTrack.getQualitativeData( context, {} );    
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get qualitative site track - invalid parameter : chromosome is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });
    
    it("Get qualitative site track - invalid parameter : chromosome < 0", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });
    
    it("Get qualitative site track - invalid parameter : position", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 5 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'position', undefined ] );
        }
    });
    
    it("Get qualitative site track - invalid parameter : position is NAN", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 5, "position": "x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'position', "x" ] );
        }
    });
    
    it("Get qualitative site track - invalid parameter : position < 0", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 5, "position": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'position', -1 ] );
        }
    });
    
    it("Get qualitative site track - missing parameter : dataset", async function(){
        try{
            await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 5, "position": 43243 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset' ] );
        }
    });
	
    it("Get qualitative site track - position with no variant", async function(){
        var expectedResult = { qualitativeData : [  ] };
        var result = await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 5, "position": 43243, "dataset": "sample:9000928"} );
        expect( result ).toEqual( expectedResult );
    });
    
    it("Get qualitative site track - with empty configuration", async function(){
        var expectedResult = { qualitativeData : [ { affectedCount : 1, sampleCount : 1, mutationData : [ { type : null, percent : 1 } ] } ] };
        var result = await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 21, "position": 50720610, "dataset": "sample:9000010" } );
        expect( result ).toEqual( expectedResult );
    });
    
   /* it("Get qualitative site track", async function(){
        var expectedResult = { qualitativeData : [ { affectedCount : 1, sampleCount : 1, mutationData : [ { type : 1, percent : 1 } ] } ] };
        var result = await QualitativeTrack.getQualitativeDataSiteTrack( context, { "reference": "GRCh37", "chrom": 21, "position": 50720610, "dataset": "sample:9000010", 
            "annotationConfig":[ {"table":"VariantAnnotations","attribute":"MutationType","categories":[ {"values":["3_prime_UTR_variant","5_prime_UTR_variant","intergenic_variant","intron_variant","start_lost","stop_gained","stop_lost","stop_retained_variant","synonymous_variant","null"] },{"values":["missense_variant","splice_donor_variant","splice_acceptor_variant"] } ] } ] } );
        expect( result ).toEqual( expectedResult );
    });*/
});
