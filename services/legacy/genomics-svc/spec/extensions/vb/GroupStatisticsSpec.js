/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );
let GroupStatistics = require(__base + "extensions/vb/GroupStatistics");

describe("GroupStatistics", function(){

    beforeEach(initDefaultContext);

    afterEach(cleanUp);
    
    it("Get GroupStatistics data - missing parameter : reference", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")({});    
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });
    
    it("Get GroupStatistics data - invalid parameter : chromosome is NAN", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")({ "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });

    it("Get GroupStatistics data - invalid parameter : chromosome < 0", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")( { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });


    it("Get GroupStatistics data- invalid parameter : position is NAN", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")({ "reference": "GRCh37", "chrom": 1, "position": 'x' } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', 'x'] );
        }
    });
    
    it("Get GroupStatistics data - invalid parameter : position < 0", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")({ "reference": "GRCh37", "chrom": 1, "position": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', -1] );
        }
    });
    
    it("Get GroupStatistics data - missing parameter : dataset", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getGeneStats")({ "reference": "GRCh37", "chrom": 1, "position": 6} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['dataset'] );
        }
    });

    /*it("Get GroupStatistics data - get procedure data for affectedgenecount function : dataset with one gene name", async function(){
        var expectedGeneVariant =  { geneVariant : [ { geneName : 'PI4KA', affectedCount : 1, totalCount : 1 } ] };
        var geneVariants = await context.getExtension("vb.GroupStatistics.getAffectedGeneCount")({ "reference": "GRCh37", "chromosome": 21, "position": 21156245 ,"dataset":"sample:31000000"} );
        expect(geneVariants).toEqual( expectedGeneVariant );
    });
    
   it("Get GroupStatistics data - get procedure data for affectedgenecount function : dataset with two gene name", async function(){
        var expectedGeneVariant =  {geneVariant : [ { geneName : 'GNAZ', affectedCount : 1, totalCount : 1 }, { geneName : 'RTDR1', affectedCount : 1, totalCount : 1 } ] };
        var geneVariants = await context.getExtension("vb.GroupStatistics.getAffectedGeneCount")({ "reference": "GRCh37", "chromosome": 21, "position": 23438131 ,"dataset":"sample:31000000"} );
        geneVariants.geneVariant = geneVariants.geneVariant.sort( function ( left, right ) { return left.geneName < right.geneName ? -1 : left.geneName > right.geneName ? +1 : 0; } );
        expect(geneVariants).toEqual( expectedGeneVariant );
    });*/
    
   it("Get GroupStatistics data - get procedure data for mergegroup function :dataset with one gene name", async function(){
        var groupResult = [{result:{ geneVariant : [ { geneName : 'LOC96610', affectedCount : 1, totalCount : 1 } ] }}];
        var parameters = { genes: [ {name: "LOC96610",description: "BMS1 homolog, ribosome assembly protein (yeast) pseudogene",aliases: [  ]}] };
        var expectedGenestatistics =  [ { statistics : [ { name : undefined, affectedCount : 1, totalCount : 1 } ] } ];
        var geneVariants = await GroupStatistics.mergeGeneGroup(context, parameters, groupResult,{ "reference": "GRCh37", "chromosome": 21, "position": 22661267 ,"dataset":"sample:31000000"} );
        expect(geneVariants).toEqual( expectedGenestatistics );
    });
    
    it("Get GroupStatistics data - get procedure data for mergegroup function :dataset with one gene name", async function(){
        var groupResult = [{name:9000702,result:{ geneVariant : [ { geneName : 'IGL@', affectedCount : 1, totalCount : 1 } ] }}];
        var parameters = { genes: [ {name: "IGL@",description: "immunoglobulin lambda locus",aliases: [  ]}] };
        var expectedGenestatistics =  [ { statistics : [ { name : 9000702, affectedCount : 1, totalCount : 1 } ] } ];
        var geneVariants = await GroupStatistics.mergeGeneGroup(context,parameters,groupResult,{ "reference": "GRCh37", "chromosome": 21, "position":22822310 ,"dataset":"sample:9000702"} );
        expect(geneVariants).toEqual( expectedGenestatistics );
    });
    
    it("Get GroupStatistics data - get procedure data for mergegroup function :dataset with two gene name", async function(){
        var groupResult = [{name:9000702,result:{ geneVariant : [ { geneName : 'RTDR1', affectedCount : 1, totalCount : 1 } ] }}];
        var parameters = { genes: [ {name: "RTDR1",description: "rhabdoid tumor deletion region gene 1",aliases: [  ]},
                                    {name: "GNAZ",description: "rhabdoid tumor deletion region gene 1",aliases: [  ]}] };
        var expectedGenestatistics =  [ { statistics : [ { name : 9000702, affectedCount : 1, totalCount : 1 } ] }, { statistics : [ { name : 9000702, affectedCount : 0, totalCount : 0 } ] } ];
        var geneVariants = await GroupStatistics.mergeGeneGroup(context,parameters,groupResult,{ "reference": "GRCh37", "chromosome": 21, "position":23439793 ,"dataset":"sample:9000702,31000514"} );
        expect(geneVariants).toEqual( expectedGenestatistics );
    }); 
    
    //Test for Allele
    
    it("Get GroupStatistics data - invalid parameter : chromosome is NAN", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getAlleleStats")({ "reference": "GRCh37", "chrom":"x" } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'x'] );
        }
    });

    it("Get GroupStatistics data - invalid parameter : chromosome < 0", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getAlleleStats")( { "reference": "GRCh37", "chrom": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -1 ] );
        }
    });


    it("Get GroupStatistics data- invalid parameter : position is NAN", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getAlleleStats")( { "reference": "GRCh37", "chrom": 1, "position": 'x' } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', 'x'] );
        }
    });
    
    it("Get GroupStatistics data - invalid parameter : position < 0", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getAlleleStats")( { "reference": "GRCh37", "chrom": 1, "position": -1 } );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['position', -1] );
        }
    });
    
    it("Get GroupStatistics data - missing parameter : dataset", async function(){
        try{
            await context.getExtension("vb.GroupStatistics.getAlleleStats")( { "reference": "GRCh37", "chrom": 1, "position": 6} );
            expect( false ).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['dataset'] );
        }
    });
    
    /*it("Get GroupStatistics data - get procedure data for affectedgenecount function : dataset with one gene name", async function(){
        var expectedAllelVariantCount = [ { name : '', affectedCount : 1, totalCount : 1 }, { name : '', affectedCount : 1, totalCount : 1 } ];
        var parameters = {"chromosome": 21,alleles:[{"sequence":'C',"type":'reference'},{"sequence":'T',"type":'subsVariant'}],"dataset":"sample:9000702",position:22930945}; 
        var geneVariants = await GroupStatistics.getAffectedAlleleCount(context, parameters);
        geneVariants = await Promise.all(geneVariants);
        expect(geneVariants).toEqual( expectedAllelVariantCount );
    });*/
    
    it("Get GroupStatistics data - get procedure data for affectedallelcount function : dataset with type reference and subsvariant", async function(){
        var groupResult = [{name:9000702,result:[{affectedCount:1,name:'9000702',totalCount:1},{affectedCount:1,name:'',totalCount:1}]},{
                            name:31000514,result:[{affectedCount:0,name:'31000514',totalCount:1},{affectedCount:0,name:'',totalCount:1}]
                            }];
        var parameters = {"chromosome": 21,alleles:[{"sequence":'C',"type":'reference'},{"sequence":'T',"type":'subsVariant'}],"dataset":"sample:9000702,31000514",position:22930945}; 
        var expectedAllelVariantCount = [{statistics : [ { affectedCount : 1, name : 9000702, totalCount : 1 }, { affectedCount : 0, name : 31000514, totalCount : 1 } ] }, 
                                        {statistics : [ { affectedCount : 1, name : 9000702, totalCount : 1 }, { affectedCount : 0, name : 31000514, totalCount : 1 } ] } ];
        var geneVariants = await GroupStatistics.mergeAlleleGroup(context, parameters,groupResult);
        expect(geneVariants).toEqual( expectedAllelVariantCount );
    });

    it("Get GroupStatistics data - get procedure data for affectedallelcount function : dataset with type reference", async function(){
        var groupResult = [{name:9000702,result:[{affectedCount:0,name:'9000702',totalCount:1},{affectedCount:0,name:'',totalCount:1}]},{
                            name:31000514,result:[{affectedCount:0,name:'31000514',totalCount:1},{affectedCount:0,name:'',totalCount:1}]
                            }];
        var parameters = {"chromosome": 21,alleles:[{"sequence":'G',"type":'reference'}],"dataset":"sample:9000702,31000514",position:42951114}; 
        var expectedAllelVariantCount = [ { statistics : [ { affectedCount : 0, name : 9000702, totalCount : 1 }, { affectedCount : 0, name : 31000514, totalCount : 1 } ] },
                                        { statistics : [ { affectedCount : 0, name : 9000702, totalCount : 1 }, { affectedCount : 0, name : 31000514, totalCount : 1 } ] } ];
        var geneVariants = await GroupStatistics.mergeAlleleGroup(context, parameters,groupResult);
        expect(geneVariants).toEqual( expectedAllelVariantCount );
    }); 
    


});