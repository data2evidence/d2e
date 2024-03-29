/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );

async function insertFeatureTrackFeatures( context, data ){
    var length = data.DWAuditID.length;
    for( var i = 0; i < length; i++ ){
        expect(await context.connection.executeUpdate(
            "insert into \"hc.hph.genomics.db.models::Reference.Features\" ( \"DWAuditID\", \"ReferenceID\", \"ChromosomeIndex\", \"Region.Begin\", \"Region.End\", \"FeatureID\", \"Class\", \"FeatureName\", \"Strand\", \"Frame\", \"Score\", \"ParentID\", \"Description\", \"FileChromosomeName\" ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
            data.DWAuditID[ i ], data.ReferenceID[ i ], data.ChromosomeIndex[ i ], data.Begin[ i ], data.End[ i ], data.FeatureID[ i ], data.Class[ i ], data.FeatureName[ i ], data.Strand[ i ], data.Frame[ i ], data.Score[ i ], data.ParentID[ i ], data.Description[ i ], data.FileChromosomeName[ i ]
        )).toBe(1);
    }
}

describe("FeatureTrack", function(){
    
    beforeEach(async function(){
        await initDefaultContext();
        
        var SNVFeFeaturesData = {
            DWAuditID: [ 2, 3, 4, 5, 6, 8, 9, 10, 11, 12 ],
            ReferenceID: [ "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37", "GRCh37" ],
            ChromosomeIndex: [ 30, 31, 30, 31, 30, 30, 30, 30, 30, 30, 30 ],
            Begin:[ 10, 140, 30, 130, 180, 220, 230, 250, 340, 390, 400 ],
            End: [ 120, 180, 80, 180, 220, 260, 280, 310, 400, 470, 490 ],
            FeatureID: [ "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10" ],
            Class: [ "gene", "gene", "gene", "gene", "gene", "gene", "gene", "gene", "gene", "gene" ],
            FeatureName: [ "klp", "koe", "eewe", "ied", "dwe", "sfd", "wer", "ojo", "opo2", "i9w" ],
            Strand: [ "+", "+", "+", "-", "+", "-", "+", "+", "+", "+" ],
            Frame:[ null, null, null, null, null, null, null, null, null, null, null, null ],
            Score: [ 1.3, 2.3, 35, 3.4, 5.2, 43, 2, 55, 6, 2, 5 ],
            ParentID: [ "ma3", "ma4", "ied", "dwe", "sfd", "wer", "loc", "locd3", "loc39", "loc90" ],
            Description: [ "desc klp", "desc koe", "eewe", "ied", "dwe", "sfd", "wer", "ojo", "opo2", "i9w" ],
            FileChromosomeName: [ "name1", "name2", "eewe", "ied", "dwe", "sfd", "wer", "ojo", "opo2", "i9w" ]
        };
        await insertFeatureTrackFeatures( context, SNVFeFeaturesData );
	});
    
    afterEach(cleanUp);
    
    it("Get Reference ID - missing parameter : reference", async function(){  
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( {} );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['reference'] );
        }
    });  
        
    it("Get chromosomeIndex - missing parameter : chromosomeIndex", async function(){ 
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( {  "reference": "GRCh37" } );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['chrom'] );
        }  
    });
    
    it("Get chromosomeIndex - invalid parameter : chromosome < 0", async function(){ 
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( {  "reference": "GRCh37" } );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['chrom'] );
        }  
    });

    it("Get begin - missing parameter : begin", async function(){
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( {"reference": "GRCh37","chrom":30} );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['begin'] );
        }   
    });
        
    it("Get begin - invalid parameter : begin < 0", async function(){   
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( {"reference": "GRCh37","chrom":30} );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['begin'] );
        } 
    });

    it("Get end - missing parameter : end", async function(){
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( { "reference": "GRCh37","chrom":31,"begin":10 } );
            expect( false ).toBeTruthy(); 
        }   
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['end'] );
        }
     });
        
    it("Get end - invalid parameter : end < 0", async function(){
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( { "reference": "GRCh37","chrom":31,"begin":10 } );
            expect( false ).toBeTruthy(); 
        }   
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['end'] );
        }
    });
        
    it("Get feat - missing parameter : feat", async function(){
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( { "reference": "GRCh37","chrom":30,"begin":10,"end":120 } );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['feat'] );
        }  
    });
        
    it("Get end - invalid parameter : end < 0", async function(){
        try{
            await context.getExtension( "vb.FeatureTrack.init" )( { "reference": "GRCh37","chrom":30,"begin":10,"end":120 } );
            expect( false ).toBeTruthy(); 
        }
        catch(exception){
            expect( exception ).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.MissingRequestParameter" );
            expect( exception.parameters ).toEqual( ['feat'] );
        } 
    });
    
    it("Return of Feature Parameter if R.B< begin and R.E > End: Features", async function(){
      var expectedfeatures = { features : [ { name : 'klp', begin : 10, end : 120, strand : '+' }, { name : 'eewe', begin : 30, end : 80, strand : '+' } ] };
      var features = await context.getExtension("vb.FeatureTrack.init")({"reference": "GRCh37", "chrom": 30, "begin": 10, "end": 180, "feat": "gene"});
      
      expect(features).toEqual(expectedfeatures);
    });

});

