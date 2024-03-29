/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );

describe("QuantitativeTrack", function(){
    
    beforeEach(initDefaultContext);
    
    afterEach(cleanUp);

    it("Get quantitative data - missing parameter : reference", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( {} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get quantitative data - invalid parameter : chromosome is NAN", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual(jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });
    
    it("Get quantitative data - invalid parameter : chromosome < 0", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual(jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });
    
    it("Get quantitative data - missing parameter : attribute", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )({ "reference": "GRCh37", "chrom": 5 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual(jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'attribute' ] );
        }
    });
    
    it("Get quantitative data - missing parameter : aggregate", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )({ "reference": "GRCh37", "chrom": 5, "attr": "fiScore" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'aggregate' ] );
        }
    });
    
    it("Get quantitative data - missing parameter : level", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )({ "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'level' ] );
        }
    });
    
    it("Get quantitative data - invalid parameter : begin", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual(jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', undefined ] );
        }
    });
    
    it("Get quantitative data - invalid parameter : begin is NAN", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )({ "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": "x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', "x" ] );
        }
    });
    
    it("Get quantitative data - invalid parameter : begin < 0", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'begin', -1 ] );
        }
    });
    
    it("Get quantitative data - missing parameter : end", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )({ "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', undefined  ] );
        }
    });
    
    it("Get quantitative data - missing parameter : end is NAN", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": "x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', "x"  ] );
        }
    });
    
    it("Get quantitative data - missing parameter : end is -1", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'end', -1  ] );
        }
    });
	
	 it("Get quantitative data - missing parameter : dataset", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": 56821 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset' ] );
        }
    });
	
	it("Get quantitative data - invalid parameter : binSize", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": 56821, "dataset": "sample:0,2" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', undefined ] );
        }
    });
    
	it("Get quantitative data - invalid parameter : binSize is NAN", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": 56821, "dataset": "sample:0,2", "binSize": "d" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', 'd'] );
        }
    });
    
    it("Get quantitative data - invalid parameter : binSize < 0", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "fiScore", "aggr":"max", "level": "Variants", "begin": 43243, "end": 56821, "dataset": "sample:0,2", "binSize": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', -1 ] );
        }
    });
    
    it("Get quantitative data - whitelist check for level", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "VariantIndex", "aggr":"maximum", "level": "variants", "begin": 43243, "end": 56821, "dataset": "sample:0,2", "binSize": 10 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['Level', 'variants' ] );

        }
    });
    
    it("Get quantitative data - whitelist check for aggregate", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": "GRCh37", "chrom": 5, "attr": "VariantIndex", "aggr":"maximum", "level": "Variants", "begin": 43243, "end": 56821, "dataset": "sample:0,2", "binSize": 10 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['Aggregate', 'maximum' ] );

        }
    }); 
    
    /*it("Get quantitative data",async  function(){
        var expectedResult = { quantityData : [ { score : 70832, binIndex : 2 }, { score : 70833, binIndex : 5 }, { score : 70834, binIndex : 7 }, { score : 71120, binIndex : 8 }, { score : 71121, binIndex : 21 } ],
                binSize : 100000, begin : 19252829, aggrScore : 71121 };
        var begin = 19252829, end = 21703684, binSize = 100000;
        var reference = "GRCh37", chrom = 21, attr = "VariantIndex", aggr = "max", level = "Variants";
        var libResult = await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": reference, "chrom": chrom, "attr": attr, "aggr":aggr, "level": level, "begin": begin, "end": end, "dataset": "sample:31000514", "binSize": binSize } );
        expect( libResult ).toEqual( expectedResult );
    });
    
    it("Get quantitative data - wrong sample", async function(){
        var expectedResult = { quantityData : [ ], 
                            binSize : 100000, begin : 30829923, aggrScore : 0 };
        var begin = 30829923, end = 31908407, binSize = 100000;
        var reference = "GRCh37", chrom = 5, attr = "VariantIndex", aggr = "max", level = "Variants";
        var libResult = await context.getExtension( "vb.QuantitativeTrack.getQuantitativeData" )( { "reference": reference, "chrom": chrom, "attr": attr, "aggr":aggr, "level": level, "begin": begin, "end": end, "dataset": "sample:0", "binSize": binSize } );
        expect( libResult ).toEqual( expectedResult );
    });*/
    
	it("Get quantitative data overview - missing parameter : reference", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( {} );    
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get quantitative data overview - missing parameter : attribute", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'attribute' ] );
        }
    });
    
    it("Get quantitative data overview - missing parameter : aggregate", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'aggregate' ] );
        }
    });
    
    it("Get quantitative data overview - missing parameter : level", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore", "aggr":"max" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'level' ] );
        }
    });
    
    it("Get quantitative data - missing parameter : dataset", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore", "aggr":"max", "level": "Variants" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset' ] );
        }
    });
    
    it("Get quantitative data overview - invalid parameter : binSize", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore", "aggr":"max", "level": "Variants", "dataset": "sample:0,2" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', undefined ] );
        }
    });
	
	it("Get quantitative data overview - invalid parameter : binSize is NAN", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore", "aggr":"max", "level": "Variants", "dataset": "sample:0,2", "binSize": "d" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', 'd'] );
        }
    });
    
    it("Get quantitative data overview - invalid parameter : binSize < 0", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "fiScore", "aggr":"max", "level": "Variants", "dataset": "sample:0,2", "binSize": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', -1 ] );
        }
    });
    
    it("Get quantitative data overview - whitelist check for level", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "VariantIndex", "aggr":"maximum", "level": "variants", "dataset": "sample:0,2", "binSize": 10 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['Level', 'variants' ] );

        }
    });
    
    it("Get quantitative data overview - whitelist check for aggregate", async function(){
        try{
            await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": "GRCh37", "attr": "VariantIndex", "aggr":"maximum", "level": "Variants", "dataset": "sample:0,2", "binSize": 10 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['Aggregate', 'maximum' ] );

        }
    });
   
   /*it("Get quantitative data overview", async function(){
        var expectedResult = { quantitativeData : [ [  ], [  ], [  ], [  ], [  ], [  ], [ { score : 71149, binIndex : 0 }, { score : 71146, binIndex : 1 } ], [  ], [  ], [  ], [ { score : 71072, binIndex : 0 }, { score : 71067, binIndex : 1 } ], [  ], [  ], [  ], [  ], [  ], [ { score : 71097, binIndex : 0 } ], [  ], [  ], [  ], [  ], [ { score : 71123, binIndex : 0 } ], [  ], [ { score : 71047, binIndex : 0 } ] ],
            binSize : 100000000, aggrScore : [ [  ], [  ], [  ], [  ], [  ], [  ], 71149, [  ], [  ], [  ], 71072, [  ], [  ], [  ], [  ], [  ], 71097, [  ], [  ], [  ], [  ], 71123, [  ], 71047 ] };
        var binSize = 100000000;
        var reference = "GRCh37", attr = "VariantIndex", aggr = "max", level = "Variants";
        var libResult = await context.getExtension( "vb.QuantitativeTrack.getQuantitativeDataOverview" )( { "reference": reference, "attr": attr, "aggr":aggr, "level": level, "dataset": "sample:31000514", "binSize": binSize } );
        expect( libResult ).toEqual( expectedResult );
    });*/
});
