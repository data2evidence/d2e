(function (exports) {

    "use strict";

    let error = require(__base + "error");
    let extensions = require(__base + "extensions");
    //var oGeneral = $.import( "hc.hph.genomics.services.extensions.vb", "General" );
    let auditLib = require(__base + "auditLog");

    // service for chromosome view
    async function getRegionData(context, parameters) {

        var referenceId = parameters.reference;

        if (referenceId === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom"]);
        }

        var begin = parseInt(parameters.begin, 10);
        if (isNaN(begin) || (begin < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["begin"]);
        }

        var end = parseInt(parameters.end, 10);
        if (isNaN(end) || (end < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["end"]);
        }

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure;
        if (parameters.sampleSpecific) {
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::RegionData");
        }
        else {
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::RegionNONSampleData");
        }
        var result = await procedure(sampleListTableName, parameters.classFilter ? parameters.classFilter : null, referenceId, chromosomeIndex, begin, end);
        var regions = [];
        for (var rowIndex in result.REGIONATTRIBUTES) {
            var resultRow = result.REGIONATTRIBUTES[rowIndex];
            regions.push({
                chromosomeIndex: resultRow.ChromosomeIndex,
                begin: resultRow.Begin, // it has to be exactly as it written in VariantBrowser.hdbdd file!
                end: resultRow.End,
                score: resultRow.Score,
                color: resultRow.Color
            });
        }
        // Log read access
        await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SV.Regions.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Score", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Color", successful: true },
        ]);
        return { regions: regions };
    }

    // service for overview view
    async function getRegionDataOverview(context, parameters) {

        var referenceId = parameters.reference;
        if (referenceId === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure;
        if (parameters.sampleSpecific) {
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::RegionData");
        }
        else {
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::RegionNONSampleData");
        }
        var result = await procedure(sampleListTableName, parameters.classFilter ? parameters.classFilter : null, referenceId, null, null, null);
        var regions = [];
        for (var rowIndex in result.REGIONATTRIBUTES) {
            var resultRow = result.REGIONATTRIBUTES[rowIndex];
            while (regions.length <= resultRow.ChromosomeIndex) {
                regions.push([]);
            }
            regions[resultRow.ChromosomeIndex].push({
                begin: resultRow.Begin,
                end: resultRow.End,
                score: resultRow.Score,
                color: resultRow.Color
            });
        }
        // Log read access
        await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SV.Regions.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Score", successful: true },
            { name: "hc.hph.genomics.db.models::SV.Regions.Color", successful: true },
        ]);
        return { regions: regions };
    }

    async function fullReload(context, parameters) {
        return await getRegionData(context, parameters);
    }

    async function init(connection, parameters) {
        return await getRegionData(context, parameters);
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.api = {
        getRegionDataOverview: getRegionDataOverview,
        init: init
    };

})(module.exports);