(function (exports) {

    "use strict";
    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let general = require(__base + "extensions/vb/General");
    let uuid = require('uuid/v1');
    let auditLib = require(__base + "auditLog");

    async function fullReload(context, parameters) {
        if (parameters.binSize <= 1) {
            return (await getVariants(context, parameters));
        }
        else {
            return (await getVariantDensity(context, parameters));
        }
    }

    async function init(context, parameters) {
        return fullReload(context, parameters);
    }

    async function getVariants(context, parameters) {
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }
        var begin = parseInt(parameters.begin, 10);
        if (isNaN(begin) || (begin < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["begin", parameters.begin]);
        }
        var end = parseInt(parameters.end, 10);
        if (isNaN(end) || (end < begin)) {
            throw new error.BioInfError("error.InvalidParameter", ["end", parameters.end]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.InvalidParameter", ["dataset", parameters.dataset]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await context.getExtension("vb.General.getAnnotationGrouping")(parameters);
        //If Variant Browser is configured regarding grouping
        if (annotationGrouping) {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::DisplayVariants");
            var results = await procedure(parameters.sampleListTableName, annotationGrouping.intermediateResults, chromosome, begin, end);
            var variants = [];
            var aResults = [];

            var variant;
            //return results;
            var y = 0.0;

            var iCurrentPos = 0;
            var oCurrentPosAllele = {};
            for (var rowIndex in results.DISPLAY_VARIANTS) {
                var resultRow = results.DISPLAY_VARIANTS[rowIndex];
                if (iCurrentPos === resultRow.Position) {
                    var aExistingAlleles = Object.keys(oCurrentPosAllele.alleles);
                    if (aExistingAlleles.indexOf(resultRow.Allele) > -1) {
                        oCurrentPosAllele.alleles[resultRow.Allele].groups.push(resultRow.Grouping);
                    } else {
                        var oAllele = {};
                        oAllele[resultRow.Allele] = { ac: resultRow.AlleleCount, groups: [] };
                        oAllele[resultRow.Allele].groups.push(resultRow.Grouping);
                        oCurrentPosAllele.alleles[resultRow.Allele] = oAllele;
                    }

                } else {
                    if (Object.keys(oCurrentPosAllele).length !== 0) {
                        aResults.push(oCurrentPosAllele);
                        oCurrentPosAllele = {};
                    }

                    //New position and new allele
                    iCurrentPos = resultRow.Position;
                    var oAllele = {};
                    oAllele[resultRow.Allele] = { alleleFrequency: [{ af: resultRow.AlleleCount / resultRow.CopyNumber }], groups: [] };
                    oAllele[resultRow.Allele].groups.push(resultRow.Grouping);

                    oCurrentPosAllele = { pos: resultRow.Position, alleles: oAllele };
                }
            }

            //Last allele
            if (Object.keys(oCurrentPosAllele).length !== 0) {
                aResults.push(oCurrentPosAllele);
            }

            // Log read access
            await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber ",successful:true}
            ], false, parameters.annotationConfig.groupConfig);
            return { groupedDisplayVariants: aResults, sampleCount: results.SAMPLE_COUNT, db: results };
            /*
            for( var i = 0; i < Object.keys(results).length; i++ ){
                var oPositionAlleles = results[ Object.keys(results)[ i ] ];
                for( var n = 0; n < Object.keys( oPositionAlleles ); n++ ){
                    var oAllele = oPositionAlleles[ Object.keys( oPositionAlleles )[ n ] ];
                    var aGroups = oAllele.groups;
                    
                    for( var m = 0; m < aGroups.length; m ++ ){
                        aGroups[ m ].alleleCount /= aGroups.length;
                    }
                }
            }*/

            /*
            if ( ( ! variant ) || ( variant.pos !== resultRow.Position ) )
            {
                variant = {
                    pos: resultRow.Position,
                    alleles: [],
                    grouping: resultRow.Grouping
                };
                y = 0.0;
            }
            if ( results.SAMPLE_COUNT === 1 )
            {
                for ( var alleleIndex = 0; alleleIndex < resultRow.AlleleCount; ++alleleIndex )
                {
                    variant.alleles.push(
                        resultRow.Allele
                    );
                }
                if ( variant.copyNumber )
                {
                    variant.copyNumber += resultRow.CopyNumber;
                }
                else
                {
                    variant.copyNumber = resultRow.CopyNumber;
                }
            }
            else
            {
                var alleleFrequency = resultRow.AlleleCount / resultRow.CopyNumber;
                variant.alleles.push( {
                    allele: resultRow.Allele,
                    y: y,
                    af: alleleFrequency,
                    grouping: resultRow.Grouping
                } );
                y += alleleFrequency;
            }
            variants.push( variant );
        }
        
        return { variants: variants, sampleCount: results.SAMPLE_COUNT };*/

        } else {
            var procedure, results;
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::DisplayVariants");
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await general.getGenomicFilterData(context, parameters);
                results = await procedure(parameters.sampleListTableName, genomicFilterResult.intermediateResults, chromosome, begin, end);
            } else {
                var emptyIntermediateResult = await context.connection.executeQuery('SELECT  "DWAuditID",  "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
                results = procedure(parameters.sampleListTableName, emptyIntermediateResult, chromosome, begin, end);
            }
            var variants = [];
            var variant;
            var y = 0.0;
            for (var rowIndex in results.DISPLAY_VARIANTS) {
                var resultRow = results.DISPLAY_VARIANTS[rowIndex];
                if ((!variant) || (variant.pos !== resultRow.Position)) {
                    variant = {
                        pos: resultRow.Position,
                        alleles: []
                    };
                    y = 0.0;
                }
                if (results.SAMPLE_COUNT === 1) {
                    for (var alleleIndex = 0; alleleIndex < resultRow.AlleleCount; ++alleleIndex) {
                        variant.alleles.push(
                            resultRow.Allele
                        );
                    }
                    if (variant.copyNumber) {
                        variant.copyNumber += resultRow.CopyNumber;
                    }
                    else {
                        variant.copyNumber = resultRow.CopyNumber;
                    }
                }
                else {
                    var alleleFrequency = resultRow.AlleleCount / resultRow.CopyNumber;
                    variant.alleles.push({
                        allele: resultRow.Allele,
                        y: y,
                        af: alleleFrequency
                    });
                    y += alleleFrequency;
                }
                variants.push(variant);
            }

            // Log read access
            await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber ",successful:true}
            ]);

            return { displayVariants: variants, sampleCount: results.SAMPLE_COUNT };
        }
    }

    async function getVariantDensity(context, parameters) {
        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }
        var begin = parseInt(parameters.begin, 10);
        if (parameters.begin === undefined) {
            begin = 0;
        }
        else if (isNaN(begin) || (begin < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["begin", parameters.begin]);
        }
        var end = null;
        if (parameters.end !== undefined) {
            end = parseInt(parameters.end, 10);
        }
        if (isNaN(end) || (end < begin)) {
            throw new error.BioInfError("error.InvalidParameter", ["end", parameters.end]);
        }
        var binSize = parseInt(parameters.binSize, 10);
        if ((binSize === undefined) || (binSize === null) || isNaN(binSize) || (binSize <= 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["binSize", parameters.binSize]);
        }
        if (!parameters.reference) {
            throw new error.BioInfError("error.InvalidParameter", ["reference", parameters.reference]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.InvalidParameter", ["dataset", parameters.dataset]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await context.getExtension("vb.General.getAnnotationGrouping")(parameters);

        //If Variant Browser is configured regarding grouping
        if (annotationGrouping) {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantAnnotationCounts");
            var results = await procedure(parameters.sampleListTableName, annotationGrouping.intermediateResults, parameters.reference, chromosomeIndex, begin, end, binSize);
            var aResults = [];
            var result = [];
            var iSize = end - begin;
            var iBinCount = Math.ceil(iSize / binSize);
            for (var rowIndex in results.VARIANT_COUNTS) {

                var resultRow = results.VARIANT_COUNTS[rowIndex];

                aResults.push(resultRow);
                //If there is an object for this group
                if (result[resultRow.Grouping]) {
                    var dBinDensity = resultRow.VariantCount;
                    if (resultRow.BinIndex < (iBinCount - 1)) {
                        dBinDensity /= results.SAMPLE_COUNT * binSize;
                    }
                    else {
                        dBinDensity /= results.SAMPLE_COUNT * (iSize - resultRow.BinIndex * binSize);
                    }
                    result[resultRow.Grouping].values[resultRow.BinIndex] = {
                        y: dBinDensity,
                        grouping: resultRow.Grouping,
                        binIndex: resultRow.BinIndex
                    };
                } else {
                    //For each category push an object
                    for (var i = 0; i < annotationGrouping.categoryCount; i++) {
                        //Fill with initial objects
                        var aValues = new Array(iBinCount);
                        for (var n = 0; n < iBinCount; n++) {
                            aValues[n] = {
                                y: 0,
                                grouping: 0
                            };
                        }

                        //Push object for group
                        result.push({ category: i, values: aValues });
                    }
                    var dBinDensity = resultRow.VariantCount;
                    if (resultRow.BinIndex < (iBinCount - 1)) {
                        dBinDensity /= results.SAMPLE_COUNT * binSize;
                    }
                    else {
                        dBinDensity /= results.SAMPLE_COUNT * (iSize - resultRow.BinIndex * binSize);
                    }
                    result[resultRow.Grouping].values[resultRow.BinIndex] = {
                        y: dBinDensity,
                        grouping: resultRow.Grouping
                    };
                }
            }

            // Log read access
            await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true}
            ], false, parameters.annotationConfig.groupConfig);
            return { groupedVariantDensity: result, sampleCount: results.SAMPLE_COUNT, maxValue: results.MAX_DENSITY, begin: begin, binSize: binSize };

        } else {
            var procedure, results;
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await general.getGenomicFilterData(context, parameters);
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantAnnotationCounts");
                results = await procedure(parameters.sampleListTableName, genomicFilterResult.intermediateResults, parameters.reference, chromosomeIndex, begin, end, binSize);
            } else {
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantCounts");
                results = await procedure(parameters.sampleListTableName, parameters.reference, chromosomeIndex, begin, end, binSize);
            }
            var size = end - begin;
            var iBinCount = Math.ceil(size / binSize);
            var density = [];
            var maxValue = 0;

            for (var rowIndex in results.VARIANT_COUNTS) {
                var resultRow = results.VARIANT_COUNTS[rowIndex];
                while (density.length < resultRow.BinIndex) {
                    density.push(0);
                }
                var binDensity = resultRow.VariantCount;
                if (resultRow.BinIndex < (iBinCount - 1)) {
                    binDensity /= results.SAMPLE_COUNT * binSize;
                }
                else {
                    binDensity /= results.SAMPLE_COUNT * (size - resultRow.BinIndex * binSize);
                }
                density.push(binDensity);
                maxValue = Math.max(maxValue, binDensity);
            }

            if (density.length > iBinCount) {
                throw new BioInfError("error.TooManyBinsReturned", [density.length, ">", iBinCount]);
            }
            while (density.length < iBinCount) {
                density.push(0);
            }

             // Log read access
             await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true}
            ]);

            return { variantDensity: density, sampleCount: results.SAMPLE_COUNT, maxValue: maxValue, begin: begin, binSize: binSize };
        }
    }

    async function getGenomeVariantDensity(context, parameters) {
        var binSize = parseInt(parameters.binSize, 10);
        if (isNaN(binSize) || (binSize <= 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["binSize", parameters.binSize]);
        }
        if (!parameters.reference) {
            throw new error.BioInfError("error.InvalidParameter", ["reference", parameters.reference]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.InvalidParameter", ["dataset", parameters.dataset]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await context.getExtension("vb.General.getAnnotationGrouping")(parameters);

        //If Variant Browser is configured regarding grouping
        if (annotationGrouping) {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantAnnotationCounts");
            var results = await procedure(parameters.sampleListTableName, annotationGrouping.intermediateResults, parameters.reference, null, 0, null, binSize);
            var result = {};
            var density;
            for (var rowIndex in results.VARIANT_COUNTS) {
                var resultRow = results.VARIANT_COUNTS[rowIndex];
                var chromosomeInfo = results.CHROMOSOME_INFOS[resultRow.ChromosomeIndex];
                var chromosomeSize = chromosomeInfo.Size;
                var iBinCount = chromosomeInfo.BinCount;

                //If there is an object for this chromosome
                if (result[resultRow.ChromosomeIndex]) {
                    var dDensity = resultRow.VariantCount / results.SAMPLE_COUNT;
                    if (resultRow.BinIndex < (chromosomeInfo.BinCount - 1)) {
                        dDensity /= binSize;
                    }
                    else {
                        dDensity /= chromosomeInfo.Size - resultRow.BinIndex * binSize;
                    }
                    result[resultRow.ChromosomeIndex][resultRow.Grouping].values[resultRow.BinIndex] = {
                        y: dDensity/*( resultRow.VariantCount / results.SAMPLE_COUNT ) / ( chromosomeSize - resultRow.BinIndex * binSize )*/,
                        grouping: resultRow.Grouping
                    };
                } else {
                    //Create array for this chromosome
                    result[resultRow.ChromosomeIndex] = [];
                    //For each category push an object
                    for (var i = 0; i < annotationGrouping.categoryCount; i++) {

                        //Fill with initial objects
                        var aValues = new Array(iBinCount);
                        for (var n = 0; n < iBinCount; n++) {
                            aValues[n] = {
                                y: 0,
                                grouping: 0
                            };
                        }

                        //Push object for group
                        result[resultRow.ChromosomeIndex].push({ category: i, values: aValues });
                    }

                    var dDensity = resultRow.VariantCount / results.SAMPLE_COUNT;
                    if (resultRow.BinIndex < (chromosomeInfo.BinCount - 1)) {
                        dDensity /= binSize;
                    }
                    else {
                        dDensity /= chromosomeInfo.Size - resultRow.BinIndex * binSize;
                    }

                    result[resultRow.ChromosomeIndex][resultRow.Grouping].values[resultRow.BinIndex] = {
                        y: dDensity/*( resultRow.VariantCount / results.SAMPLE_COUNT ) / ( chromosomeSize - resultRow.BinIndex * binSize )*/,
                        grouping: resultRow.Grouping
                    };
                }
            }

             // Log read access
             await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true}
            ], false, parameters.annotationConfig.groupConfig);
            return { categories: result, sampleCount: results.SAMPLE_COUNT, maxValue: results.MAX_DENSITY };


            /*while ( result.length <= resultRow.ChromosomeIndex )
            {
                result.push( [] );
            }
            density = result[ resultRow.ChromosomeIndex ];
            while ( density.length < resultRow.BinIndex )
            {
                density.push( 0 );
            }
            density.push( resultRow.VariantCount / results.SAMPLE_COUNT );*/

            /*for ( var rowIndex in results.VARIANT_COUNTS )
            {
                var resultRow = results.VARIANT_COUNTS[ rowIndex ];
        
                while ( result.length <= resultRow.ChromosomeIndex )
                {
                    result.push( [] );
                }
                density = result[ resultRow.ChromosomeIndex ];
                while ( density.length < resultRow.BinIndex )
                {
                    density.push( 0 );
                }
                density.push( resultRow.VariantCount / results.SAMPLE_COUNT );
            }
        
            for ( var chromosomeIndex in results.CHROMOSOME_INFOS )
            {
                var chromosomeInfo = results.CHROMOSOME_INFOS[ chromosomeIndex ];
                while ( result.length <= chromosomeIndex )
                {
                    result.push( [] );
                }
                density = result[ chromosomeIndex ];
        
                for ( var binIndex in density )
                {
                    if ( density.length > chromosomeInfo.BinCount )
                    {
                        throw new BioInfError( "error.TooManyBinsReturned", [ density.length, ">", chromosomeInfo.BinCount ] ); 
                    }
                    
                    if ( binIndex < ( chromosomeInfo.BinCount - 1 ) )
                    {
                        density[ binIndex ] /= binSize;
                    }
                    else
                    {
                        density[ binIndex ] /= chromosomeInfo.Size - binIndex * binSize;
                    }
                }
                
                while ( density.length < chromosomeInfo.BinCount )
                {
                    density.push( 0 );
                }
            }
        
            return result; */


        } else {
            var procedure, results;
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await general.getGenomicFilterData(context, parameters);
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantAnnotationCounts");
                results = await procedure(parameters.sampleListTableName, genomicFilterResult.intermediateResults, parameters.reference, null, 0, null, binSize);
            } else {
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantCounts");
                results = await procedure(parameters.sampleListTableName, parameters.reference, null, 0, null, binSize);
            }

            var result = [];
            var density;

            for (var rowIndex in results.VARIANT_COUNTS) {
                var resultRow = results.VARIANT_COUNTS[rowIndex];

                while (result.length <= resultRow.ChromosomeIndex) {
                    result.push([]);
                }
                density = result[resultRow.ChromosomeIndex];
                while (density.length < resultRow.BinIndex) {
                    density.push(0);
                }
                density.push(resultRow.VariantCount / results.SAMPLE_COUNT);
            }

            for (var chromosomeIndex in results.CHROMOSOME_INFOS) {
                var chromosomeInfo = results.CHROMOSOME_INFOS[chromosomeIndex];
                while (result.length <= chromosomeIndex) {
                    result.push([]);
                }
                density = result[chromosomeIndex];

                for (var binIndex in density) {
                    if (density.length > chromosomeInfo.BinCount) {
                        throw new BioInfError("error.TooManyBinsReturned", [density.length, ">", chromosomeInfo.BinCount]);
                    }

                    if (binIndex < (chromosomeInfo.BinCount - 1)) {
                        density[binIndex] /= binSize;
                    }
                    else {
                        density[binIndex] /= chromosomeInfo.Size - binIndex * binSize;
                    }
                }

                while (density.length < chromosomeInfo.BinCount) {
                    density.push(0);
                }
            }

             // Log read access
             await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
                {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
                {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true}
            ]);
            return result;
        }

    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getGenomeVariantDensity = getGenomeVariantDensity;
    exports.fullReload = fullReload;
    exports.getVariants = getVariants;
    exports.getVariantDensity = getVariantDensity;

    exports.api = {
        getGenomeVariantDensity: getGenomeVariantDensity,
        fullReload: fullReload,
        getVariants: getVariants,
        getVariantDensity: getVariantDensity
    };

})(module.exports);