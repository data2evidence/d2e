/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

let error = require( __base + "error" );

describe ("Variant Track Test", function() {
    
    beforeEach(initDefaultContext);
    
    afterEach(cleanUp);

    // Error Handling in getVariants() function  

    it ("get Variants - error handling: chromosome = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")( { "chrom":"o" } );    
            expect(false).toBeTruthy();    
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'o'] );
        }
    });
    
        it ("get Variants - error handling: chromosome < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")( { "chrom": -5 } );   
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -5 ] );
        }
    });
    
        it ("get Variants - error handling: begin = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")( {"chrom": 1, "begin": "o" } );  
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['begin', 'o'] );
        }
    });
    
        it ("get Variants - error handling: begin < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")({ "chrom": 1, "begin": -5 } );  
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['begin', -5] );
        }
    });
    
        it ("get Variants - error handling: end = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")({"chrom": 1, "begin": 10, "end": "o" } );   
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['end', 'o'] );
        }
    });
    
        it ("get Variants - error handling: end < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariants")( {"chrom": 1, "begin": 10, "end": -5 } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['end', -5] );
        }
    });
    
     it("get Variants - error handling: !parameters.dataset", async function(){
         
        try{
            await context.getExtension("vb.VariantTrack.getVariants")({ "chrom": 1, "begin": 10, "end": 10000 } );      
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset', undefined ] );
        }
    });
    
// Test of getVariants() function 
    
/*    it("get Variants - test: position, alleles and copynumber for one sample", async function(){
        
        var variantIndex = 0;
        var resultIndex = 0;
        var alleleIndex = 0;
        var expectedResult = await context.connection.executeQuery('SELECT g."SampleIndex" AS "SampleIndex",\
                                                      v."Position" AS "Position", \
                                                      g."CopyNumber" AS "CopyNumber", \
                                                      va."Allele" AS "Allele", \
                                                      ga."AlleleCount" AS "AlleleCount" \
                                                      FROM "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Variants" AS v \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Genotypes" AS g \
                                                      ON v."DWAuditID" = g."DWAuditID"  AND v."VariantIndex" = g."VariantIndex"  \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.GenotypeAlleles" AS ga \
                                                      ON g."DWAuditID" = ga."DWAuditID"  AND g."VariantIndex" = ga."VariantIndex" AND g."SampleIndex" = ga."SampleIndex" \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.VariantAlleles" AS va \
                                                      ON ga."DWAuditID" = va."DWAuditID"  AND ga."VariantIndex" = va."VariantIndex" AND ga."AlleleIndex" = va."AlleleIndex" \
                                                      WHERE \
                                                        v."ChromosomeIndex" = 10 AND \
                                                        v."Position" BETWEEN 100000000 AND 103000000 AND \
                                                        g."SampleIndex" = 9000950 AND \
                                                        g."ReferenceAlleleCount" <> g."CopyNumber" AND \
                                                        ( ga."AlleleCount" > 0 OR ga."AlleleIndex" = 0 ) \
                                                     ORDER BY v."Position", va."AlleleIndex", g."CopyNumber" ');

		extensions.validationPlugin = "internal.validate";
		extensions.validationParameters = {};
        var result = await context.getExtension("vb.VariantTrack.getVariants")({ "chrom": 10, "begin": 100000000, "end": 103000000 , "dataset": "sample:9000950" } );
        for ( variantIndex in result.displayVariants )
        {
            expect(result.displayVariants.length).toBeGreaterThan(0);
            expect(result.displayVariants[ variantIndex ].pos ).toBe( expectedResult[ resultIndex ].Position );
            expect( result.displayVariants[ variantIndex ].copyNumber ).toBe( expectedResult[ resultIndex ].CopyNumber );
            ++resultIndex;
            for ( alleleIndex = 0; resultIndex < expectedResult.length && result.displayVariants[ variantIndex ].pos === expectedResult[ resultIndex ].Position; ++alleleIndex, ++resultIndex )
            {
                expect( alleleIndex ).toBeLessThan( result.displayVariants[ variantIndex ].alleles.length );
                expect( result.displayVariants[ variantIndex ].copyNumber ).toBe( expectedResult[ resultIndex ].CopyNumber );
                expect( result.displayVariants[ variantIndex ].alleles[alleleIndex] ).toBe( expectedResult[ resultIndex ].Allele );
            }
        }
        expect(resultIndex).toBe(expectedResult.length);
    });
    
    it("get Variants - test: position, alleles and copynumber for two samples", async function(){
        
        var variantIndex = 0;
        var resultIndex = 0;
        var alleleIndex = 0;
        var totalAF = 0;
        var expectedResult = await context.connection.executeQuery('SELECT g."SampleIndex" AS "SampleIndex",\
                                                      v."Position" AS "Position", \
                                                      g."CopyNumber" AS "CopyNumber", \
                                                      va."Allele" AS "Allele", \
                                                      ga."AlleleCount" AS "AlleleCount" \
                                                      FROM "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Variants" AS v \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Genotypes" AS g \
                                                      ON v."DWAuditID" = g."DWAuditID"  AND v."VariantIndex" = g."VariantIndex"  \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.GenotypeAlleles" AS ga \
                                                      ON g."DWAuditID" = ga."DWAuditID"  AND g."VariantIndex" = ga."VariantIndex" AND g."SampleIndex" = ga."SampleIndex" \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.VariantAlleles" AS va \
                                                      ON ga."DWAuditID" = va."DWAuditID"  AND ga."VariantIndex" = va."VariantIndex" AND ga."AlleleIndex" = va."AlleleIndex" \
                                                      WHERE \
                                                        v."ChromosomeIndex" = 10 AND \
                                                        v."Position" BETWEEN 100000000 AND 103000000 AND \
                                                        g."SampleIndex" IN (9000950, 9000944 ) AND \
                                                        g."ReferenceAlleleCount" <> g."CopyNumber" AND \
                                                        ( ga."AlleleCount" > 0 OR ga."AlleleIndex" = 0 ) \
                                                     ORDER BY v."Position", va."AlleleIndex", g."CopyNumber", g."SampleIndex" ');

		extensions.validationPlugin = "internal.validate";
		extensions.validationParameters = {};
        var result = await context.getExtension("vb.VariantTrack.getVariants")( { "chrom": 10, "begin": 100000000, "end": 103000000, "dataset": "sample: 9000950,9000944 " } );

        for ( variantIndex in result.displayVariants )
        {
            expect(result.displayVariants.length).toBeGreaterThan(0);
            expect(result.displayVariants[ variantIndex ].pos ).toBe( expectedResult[ resultIndex ].Position );
            ++resultIndex;
            totalAF = 0;
            for ( alleleIndex = 0; resultIndex < expectedResult.length && result.displayVariants[ variantIndex ].pos === expectedResult[ resultIndex ].Position; ++alleleIndex, ++resultIndex )
            {
                expect( alleleIndex ).toBeLessThan( result.displayVariants[ variantIndex ].alleles.length );
                expect( result.displayVariants[ variantIndex ].alleles[alleleIndex].allele ).toBe( expectedResult[ resultIndex ].Allele );
                expect( result.displayVariants[ variantIndex ].alleles[ alleleIndex ].af ).toBeCloseTo( expectedResult[ resultIndex ].AlleleCount / expectedResult[ resultIndex ].CopyNumber );
                totalAF += result.displayVariants[ variantIndex ].alleles[ alleleIndex ].af;
            }
            expect( totalAF ).not.toBeGreaterThan( 1.0 );
        }
        expect(resultIndex).toBe(expectedResult.length);
    }); */
    
// Error Handling in getVariantDensity() function  

    it ("get Variant Density - error handling: chromosome = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({ "chrom":"o" } );  
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', 'o'] );
        }
    });
    
    it ("get Variant Densitys - error handling: chromosome < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({ "chrom": -5 } );   
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['chrom', -5 ] );
        }
    });
    
    it ("get Variant Densitys - error handling: begin = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")( {"chrom": 1, "begin": "o" } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['begin', 'o'] );
        }
    });
    
    it ("get Variant Densitys - error handling: begin < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({ "chrom": 1, "begin": -5 } );
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['begin', -5] );
        }
    });
    
    it ("get Variant Density - error handling: end = undefined", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({"chrom": 5, "begin": 10} );
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['end', undefined] );
        }
    });
    
    it ("get Variant Density - error handling: end = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({"chrom": 1, "begin": 10, "end": "o" } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['end', 'o'] );
        }
        
    });
    
    it ("get Variant Density - error handling: end < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({"chrom": 1, "begin": 10, "end": -5 } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['end', -5] );
        }
        
    });
    
    it ("get Variant Density - error handling: binSize = undefined", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")( {"chrom": 5, "begin": 10, "end": 10000} );
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', undefined] );
        }
        
    });
    
    it ("get Variant Density - error handling: binSize = null", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({"chrom": 5, "begin": 10, "end": 10000, "binSize": null } );
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', null] );
        }
        
    });
    
    it ("get Variant Density - error handling: binSize = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")( {"chrom": 1, "begin": 10, "end": 10000, "binSize": "b" } );  
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', 'b'] );
        }
    });
    
    it ("get Variant Density - error handling: binSize < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")( { "chrom": 1, "begin": 10, "end": 10000, "binSize": -3 } );   
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', -3] );
        }
    });
    
    it("get Variant Densitys - error handling: !parameters.reference",async function(){
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({"chrom": 1, "begin": 10, "end": 10000, "binSize": 1000} );  
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['reference', undefined] );
        }
    });
    
    it("get Variant Density - error handling: !parameters.dataset", async function(){
        try{
            await context.getExtension("vb.VariantTrack.getVariantDensity")({ "chrom": 1, "begin": 10, "end":'10000', "binSize": 1000, "reference": "GRCh37", "dataset": undefined } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset', undefined ] );
        }
    });
    
    // Test of getVariantDensity() function
    
    /*it("get Variant Density - test: density & binSize", function(){
        
        var resultIndex = 0;
        var binIndex = 0;
        var iChromosomeIndex = 10;
        var iBinSize = 1000;
        var iBegin = 100000000;
        var iEnd = 103000000;
        
        var expectedResult = connection.executeQuery('SELECT g."SampleIndex" AS "SampleIndex",\
                                                             v."Position" AS "Position" \
                                                      FROM "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Variants" AS v \
                                                      INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Genotypes" AS g \
                                                      ON v."DWAuditID" = g."DWAuditID"  AND v."VariantIndex" = g."VariantIndex"  \
                                                      WHERE \
                                                        v."ChromosomeIndex" = ? AND \
                                                        v."Position" BETWEEN ? AND (?-1) AND \
                                                        g."SampleIndex" = 9000950 AND \
                                                        g."ReferenceAlleleCount" <> g."CopyNumber" \
                                                     ORDER BY g."SampleIndex", v."Position" ', 
                                                     iChromosomeIndex,
                                                     iBegin,
                                                     iEnd);
                                                     
        oExtensions.validationPlugin = "internal.validate";
		oExtensions.validationParameters = {};
        var result = oVariantTrack.getVariantDensity( connection, { "chrom": iChromosomeIndex, "begin": iBegin, "end": iEnd, "binSize": iBinSize, "reference": "GRCh37", "dataset": "sample:9000950" } );
        var binCount = Math.ceil( ( iEnd - iBegin) / iBinSize );
        expect(result.sampleCount).toBe(1);
        expect(result.variantDensity.length).toBe(binCount);

        while ((resultIndex < expectedResult.length) && (binIndex < result.density.length)){ // expectedResult lenght = 16, result.desity.length = 10000000
            var resultBinIndex = Math.floor((expectedResult[resultIndex].Position - iBegin) / iBinSize); 
            if(binIndex < resultBinIndex ){ 
                ++binIndex; 
            }
            else if (binIndex > resultBinIndex){ 
                expect(result.variantDensity[ binIndex ] ).toBe( 0 ); // test density == 0
                ++resultIndex;
            }
            else{
                expect(result.variantDensity[ binIndex ] ).toBeGreaterThan( 0 ); // test density > 0 
                ++resultIndex;
                ++binIndex;
            }
        }

        while (binIndex < result.variantDensity.length){
            expect(result.variantDensity[ binIndex ] ).toBe( 0 ); // test density == 0
            ++binIndex;
        }
    });*/
    
    
    
// Error Handling in getGenomeVariantDensity() function      

    it ("get Genome Variant Density - error handling: binSize = isNaN", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getGenomeVariantDensity")({"binSize": "b" } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', 'b'] );
        }
    });
    
    it ("get Genome Variant Density - error handling: binSize < 0", async function(){
        
        try{
            await context.getExtension("vb.VariantTrack.getGenomeVariantDensity")({ "binSize": -3 } );
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['binSize', -3] );
        }
    });
    
        
    it("get Genome Variant Density - error handling: !parameters.reference", async function(){
        try{
            await context.getExtension("vb.VariantTrack.getGenomeVariantDensity")({"binSize": 1000} ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( ['reference', undefined] );
        }
    });
    
    it("get Genome Variant Density - error handling: !parameters.dataset", async function(){
        try{
            await context.getExtension("vb.VariantTrack.getGenomeVariantDensity")({ "binSize": 1000, "reference": "GRCh37" } ); 
            expect(false).toBeTruthy();
        }catch( exception ){
            expect( exception).toEqual( jasmine.any( error.BioInfError ) );
            expect( exception.errorCode ).toBe( "error.InvalidParameter" );
            expect( exception.parameters ).toEqual( [ 'dataset', undefined ] );
        }
    });
    
    // Test of getGenomeVariantDensity() function
    
/*    it("get Genome Variant Density - test density on every Chromosome", async function(){
        
        var genResultIndex = 0;
        var binIndex;
        var iBinSize = 100000;
        var iChromosomeIndex = 0;
        var expectedGenResult;
        
        var genResult = await context.getExtension("vb.VariantTrack.getGenomeVariantDensity")( {  "binSize": iBinSize, "reference": "GRCh37", "dataset": "sample:9000950"} ); 
        //genResult.length is the number of chromosomes
        expect(genResult.length).toBe(24); 

        for ( iChromosomeIndex = 0; iChromosomeIndex < 24; ++iChromosomeIndex )
        {
         
            expectedGenResult = await context.connection.executeQuery('SELECT g."SampleIndex" AS "SampleIndex",\
                                                                 v."Position" AS "Position" \
                                                            FROM "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Variants" AS v \
                                                            INNER JOIN "CDMDEFAULT"."hc.hph.genomics.db.models::SNV.Genotypes" AS g \
                                                            ON v."DWAuditID" = g."DWAuditID"  AND v."VariantIndex" = g."VariantIndex"  \
                                                            WHERE \
                                                            v."ChromosomeIndex" = ? AND \
                                                            g."SampleIndex" = 9000950 AND \
                                                            g."ReferenceAlleleCount" <> g."CopyNumber" \
                                                            ORDER BY g."SampleIndex", v."Position" ', iChromosomeIndex);

            binIndex = 0;
            while ((genResultIndex < expectedGenResult.length) && (binIndex < genResult[ iChromosomeIndex ].length)){ 
                var resultBinIndex = Math.floor((expectedGenResult[genResultIndex].Position) / iBinSize); 
                if(binIndex < resultBinIndex ){ 
                    ++binIndex; 
                }
                else if (binIndex > resultBinIndex){ 
                    expect(genResult[ iChromosomeIndex ][ binIndex ] ).toBeCloseTo( 0 );
                    ++genResultIndex;
                }
                else{
                    expect(genResult[ iChromosomeIndex ][ binIndex ] ).toBeGreaterThan( 0 ); 
                    ++genResultIndex;
                    ++binIndex;
                }
            }
    
            while (binIndex < genResult[ iChromosomeIndex ].length){
                expect(genResult[ iChromosomeIndex ][ binIndex ] ).toBeCloseTo( 0 ); 
                ++binIndex;
            }
        }

     }); */
    
});