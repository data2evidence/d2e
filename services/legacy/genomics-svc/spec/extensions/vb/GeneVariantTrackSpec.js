/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );

describe("GeneVariantTrack", function(){
    
    beforeEach(initDefaultContext);
    
    afterEach(cleanUp);
    
    it("Get gene Variants - missing parameter : reference", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariants")({});   
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get gene Variants - invalid parameter : chromosome is NAN", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariants")({ "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });
    
    it("Get gene Variants - invalid parameter : chromosome < 0", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariants")( { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });
    
    it("Get gene Variants - missing parameter : dataset", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariants")({ "reference": "GRCh37", "chrom": 5 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset' ] );
        }
    });
    
  /*  it("Get gene Variants 2 samples", async function(){
        var oGenes =  await context.getExtension("vb.GeneVariantTrack.getGeneVariants")( { "reference": "GRCh37", "chrom": 21, "dataset": "sample:9000702,31000514" } );
        expect( oGenes.sampleCount ).toEqual( 2 );
        expect( oGenes.genes.length ).toEqual( 41 );
    });
    
    it("Get gene Variants - 1 sample", async function(){
        var oGenes =  await context.getExtension("vb.GeneVariantTrack.getGeneVariants")( { "reference": "GRCh37", "chrom": 21, "dataset": "sample:9000702" } );
        expect( oGenes.sampleCount ).toEqual( 1 );
        expect( oGenes.genes.length ).toEqual( 21 );
    });
    
    it("Get gene Variants - no variants", async function(){
        var expectedGeneVariant = { genes : [  ], sampleCount : 1 };
        await context.getExtension("datasets.sample.setSamples")({ groupId: "9000702" } );
        var oGenes =  await context.getExtension("vb.GeneVariantTrack.getGeneVariants")({ "reference": "GRCh37", "chrom": 25, "dataset": "sample:9000702" } );
        expect( oGenes.genes.length ).toEqual( 0 );
        expect( oGenes ).toEqual( expectedGeneVariant );
    });
    
    it("Get gene overview - missing parameter : reference", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariantsOverview")( {} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get gene overview - missing parameter : dataset", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneVariantsOverview")( { "reference": "GRCh37" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['dataset'] );
        }
    });
    
    it("Get gene overview", async function(){
        var oGeneVariant = await context.getExtension("vb.GeneVariantTrack.getGeneVariantsOverview")( { "reference": "GRCh37", "dataset": "sample:9000702" } );
        expect( oGeneVariant.genes.length ).toEqual( 22 );
    }); */
    
    it("Get gene site track - missing parameter : reference", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")( {} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get gene site track - invalid parameter : chromosome is NAN", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")( { "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });
    
    it("Get gene site track - invalid parameter : chromosome < 0", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")({ "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1] );
        }
    });
    
    it("Get gene site track - invalid parameter : position < 0", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")( { "reference": "GRCh37", "chrom": 1, "position": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', -1] );
        }
    });
    
    it("Get gene site track - invalid parameter : position is NAN", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")( { "reference": "GRCh37", "chrom": 1, "position": 'x' } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', 'x'] );
        }
    });
    
    it("Get gene site track - missing parameter : dataset", async function(){
        try{
            await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")({ "reference": "GRCh37", "chrom": 1, "position": 6} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['dataset'] );
        }
    });
    
   /* it("Get gene site track", async function(){
        var expectedGeneVariant =  { geneVariant : [ { geneName : 'DEPDC5', count : 2 } ], sampleCount : 2 };
        await context.getExtension("datasets.sample.setSamples")({ groupId: "9000702,31000514" } );
        var oGeneVariant =  await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")( { "reference": "GRCh37", "chrom": 21, "position": 32217804, "dataset":"sample:9000702,31000514" } );
        expect( oGeneVariant ).toEqual( expectedGeneVariant );
    });
    
    it("Get gene site track - 2 genes", async function(){
        var expectedGeneVariant = { geneVariant : [ { geneName : 'GNAZ', count : 1 }, { geneName : 'RTDR1', count : 1 } ], sampleCount : 1 };
        var oGeneVariant =  await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")({ "reference": "GRCh37", "chrom": 21, "position": 23445750, "dataset":"sample:9000702" } );
        oGeneVariant.geneVariant = oGeneVariant.geneVariant.sort( function ( left, right ) { return left.geneName < right.geneName ? -1 : left.geneName > right.geneName ? +1 : 0; } );
        expect( oGeneVariant ).toEqual( expectedGeneVariant );
    });
    
    it("Get gene site track - no variants", async function(){
        var expectedGeneVariant = { geneVariant : [  ], sampleCount : 2 };
        await context.getExtension("datasets.sample.setSamples")( { groupId: "9000702,31000514" } );
        var oGeneVariant =  await context.getExtension("vb.GeneVariantTrack.getGeneSiteTrack")({ "reference": "GRCh37", "chrom": 1, "position": 41413539, "dataset":"sample:9000702,31000514" } );
        expect( oGeneVariant ).toEqual( expectedGeneVariant );
    });*/
});