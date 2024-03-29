(function (exports) {

    "use strict";

    let error = require(__base + "error");
    let extensions = require(__base + "extensions");
    let oGeneral = require(__base + "extensions/vb/General");
    let uuid = require('uuid/v1');
    let auditLib = require(__base + "auditLog");

    async function fullReload(context, parameters) {
        return getQualitativeData(context, parameters);
    }

    async function init(context, parameters) {
        return getQualitativeData(context, parameters);
    }

    async function getQualitativeData(context, parameters) {

        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

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
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        var binSize = parseInt(parameters.binSize, 10);
        if (isNaN(binSize) || (binSize < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["binSize", parameters.binSize]);
        }
        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping;
        if (parameters.annotationConfig && parameters.annotationConfig.groupConfig && parameters.annotationConfig.groupConfig.categories.length > 0) {
            annotationGrouping = await oGeneral.getAnnotationGrouping(context, parameters);
        } else {
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                annotationGrouping = await oGeneral.getGenomicFilterData(context, parameters);
            } else {
                annotationGrouping = await getAnnotationGrouping(context, parameters);
            }
        }
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::QualitativeData");
        if (binSize < 1) {
            binSize = 1;
        }
        var results = await procedure(parameters.sampleListTableName, parameters.reference, chromosome, begin, end, binSize, annotationGrouping.intermediateResults);
        var prevBinNumber = -1;
        var curBinNumber = -1;
        var qualitativeData = [];
        var sampleRowIndex = 0;
        for (var rowIndex in results.QUALITATIVE_DATA) {
            var resultRow = results.QUALITATIVE_DATA[rowIndex];
            curBinNumber = resultRow.BinIndex;
            if (prevBinNumber !== curBinNumber) {
                qualitativeData.push({
                    binIndex: curBinNumber,
                    begin: resultRow.BeginPos,
                    end: resultRow.EndPos,
                    fraction: resultRow.BinPatientFraction,
                    mutationData: []
                });
            }
            var binEntry = qualitativeData[qualitativeData.length - 1];
            binEntry.begin = Math.min(binEntry.begin, resultRow.BeginPos);
            binEntry.end = Math.max(binEntry.end, resultRow.EndPos);
            binEntry.mutationData.push({
                type: resultRow.Grouping,
                percent: resultRow.GroupPatientFraction
            });
            prevBinNumber = curBinNumber;
        }
        // Log read access
        await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
            ], false, parameters.annotationConfig ? parameters.annotationConfig.groupConfig : undefined);
        return { qualitativeData: qualitativeData, binSize: binSize, begin: begin };
    }

    async function getQualitativeDataSiteTrack(context, parameters) {
        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }

        var position = parseInt(parameters.position, 10);
        if (isNaN(position) || (position < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["position", parameters.position]);
        }

        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping;
        if (parameters.annotationConfig && parameters.annotationConfig.groupConfig && parameters.annotationConfig.groupConfig.categories.length > 0) {
            annotationGrouping = await oGeneral.getAnnotationGrouping(context, parameters);
        } else {
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                annotationGrouping = await oGeneral.getGenomicFilterData(context, parameters);
            } else {
                annotationGrouping = await getAnnotationGrouping(context, parameters);
            }
        }
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::MutationDataAnnotation");
        var results = await procedure(parameters.sampleListTableName, parameters.reference, chromosome, position, position + 1, annotationGrouping.intermediateResults);
        var mutationData = [];
        var qualitativeData = [];
        var resultRow;
        for (var rowIndex in results.MUTATION_DATA) {
            resultRow = results.MUTATION_DATA[rowIndex];
            mutationData.push({
                type: resultRow.Grouping,
                percent: resultRow.Percent
            });
        }
        if (resultRow) {
            qualitativeData.push({ affectedCount: results.AFFECTED_COUNT, sampleCount: results.SAMPLE_COUNT, mutationData: mutationData });
        }
        // Log read access
        await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
        ], false, parameters.annotationConfig ? parameters.annotationConfig.groupConfig : undefined);
        return { qualitativeData: qualitativeData };
    }

    async function getAnnotationGrouping(context, parameters) {
        var tableName = await context.createTemporaryVariantGroupingTable();
        var sQuery = 'INSERT INTO "' + tableName + '" SELECT gt."DWAuditID", gt."VariantIndex", NULL AS "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" AS gt JOIN "' + parameters.sampleListTableName + '" AS samples ON gt."SampleIndex" = samples."SampleIndex" WHERE gt."ReferenceAlleleCount" != gt."CopyNumber"';
        await context.connection.executeQuery( sQuery );
        return { intermediateResults: tableName};
    }

    /*
    Needed for CDS position -- DO Not delete
    
    function getQualitativeSiteTrack( connection, parameters ){
        if ( ! parameters.reference )
        {
            throw new BioInfError( "error.MissingRequestParameter", [ "reference" ] );
        }
        var chromosome = parseInt( parameters.chrom, 10 );
        if ( isNaN( chromosome ) || ( chromosome < 0 ) )
        {
            throw new BioInfError( "error.InvalidParameter", [ "chrom", parameters.chrom ] );
        }
        
        var begin = parseInt( parameters.begin, 10 );
        if ( isNaN( begin ) || ( begin < 0 ) )
        {
            throw new BioInfError( "error.InvalidParameter", [ "begin", parameters.begin ] );
        }
        
        var end = parseInt( parameters.end, 10 );
        if ( isNaN( end ) || ( end < begin ) )
        {
            throw new BioInfError( "error.InvalidParameter", [ "end", parameters.end ] );
        }
        
        if ( ! parameters.dataset )
        {
            throw new BioInfError( "error.MissingRequestParameter", [ "dataset" ] );
        }
        
        let sampleListTableName = oExtensions.setSamplesFromDataset( connection, parameters.dataset );
        var procedure = connection.loadProcedure( "hc.hph.genomics.db.procedures.vb::MutationData" );
        var results = procedure( sampleListTableName, parameters.reference, chromosome, begin, end );
        var prevGeneName = -1;
        var curGeneName = -1;
        var mutationData = [];
        var qualitativeData = [];
        for ( var rowIndex in results.MUTATION_DATA )
        {
            var resultRow = results.MUTATION_DATA[ rowIndex ];
            curGeneName = resultRow.GeneName;
            if( prevGeneName === curGeneName ){
                mutationData.push( {
                    type: resultRow.MutationType,
                    percent: resultRow.Percent
                } );
            } else {
                qualitativeData.push( createQualitativeData( prevGeneName, results.AFFECTED_GENE, mutationData )  );
                prevGeneName = curGeneName;
                mutationData = [];
                mutationData.push( {
                    type: resultRow.MutationType,
                    percent: resultRow.Percent
                } );
            }
        }
        if( resultRow ){
            qualitativeData.push( createQualitativeData( prevGeneName, results.AFFECTED_GENE, mutationData ) );
        }
        qualitativeData = qualitativeData.slice( 1, qualitativeData.lenth );
        return { qualitativeData: qualitativeData };
    }
    
    function createQualitativeData( sGeneName, aAffectedGene, aMutationData ){
        var percent = 0;
        var description = "";
        for ( var iRow in aAffectedGene )
        {
            var row = aAffectedGene[ iRow ];
            var geneName = row.GeneName;
            if ( geneName === sGeneName ){
                percent = row.Percent.toFixed( 2 );
                description = row.Description;
                break;
            }
        }
         var qualitativeData = {
            geneName: sGeneName,
            description: description,
            percent: percent,
            mutationData: aMutationData
        };
        return qualitativeData;
    }
    */

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.init = init;
    exports.getQualitativeData = getQualitativeData;
    exports.getQualitativeDataSiteTrack = getQualitativeDataSiteTrack;

    exports.api = {
        init: init
    };

})(module.exports);