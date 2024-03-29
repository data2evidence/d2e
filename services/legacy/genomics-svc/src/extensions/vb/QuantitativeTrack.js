(function (exports) {

    "use strict";
    let extensions = require(__base + "extensions");
    let error = require(__base + "error");

    async function fullReload(context, parameters) {
        return getQuantitativeData(context, parameters);
    }

    async function init(context, parameters) {
        return getQuantitativeData(context, parameters);
    }

    async function getQuantitativeData(context, parameters) {

        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }

        if (!parameters.attr) {
            throw new error.BioInfError("error.MissingRequestParameter", ["attribute"]);
        }

        if (!parameters.aggr) {
            throw new error.BioInfError("error.MissingRequestParameter", ["aggregate"]);
        }

        if (!parameters.level) {
            throw new error.BioInfError("error.MissingRequestParameter", ["level"]);
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

        var aggr = null;
        if (parameters.aggr.toLowerCase() === "min") {
            aggr = Math.min;
        }
        else if (parameters.aggr.toLowerCase() === "max") {
            aggr = Math.max;
        }
        else if (parameters.aggr.toLowerCase() === "avg") {
            aggr = function (left, right) { return left + right; };
        }

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::QuantitativeData");
        var results = await procedure(sampleListTableName, parameters.reference, chromosome, begin, end, binSize, parameters.level, parameters.attr, parameters.aggr);
        if (results.WHITE_LIST_INVALID) {
            var result = results.WHITE_LIST_INVALID.split(" ");
            throw new error.BioInfError("error.InvalidParameter", [result[10], result[11]]);
        }
        var quantityData = [];
        var aggrScore = 0;
        for (var rowIndex in results.$resultSets[0]) {
            var resultRow = results.$resultSets[0][rowIndex];
            quantityData.push({
                score: resultRow.Score,
                binIndex: Math.floor(parseFloat(resultRow.BinIndex))
            });
            aggrScore = (aggrScore === undefined ? resultRow.Score : aggr(aggrScore, resultRow.Score));
        }
        if (parameters.aggr.toLowerCase() === "avg") {
            aggrScore /= results.$resultSets[0].length;
        }

        return { quantityData: quantityData, aggrScore: aggrScore, binSize: binSize, begin: begin };
    }

    async function getQuantitativeDataOverview(context, parameters) {

        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        if (!parameters.attr) {
            throw new error.BioInfError("error.MissingRequestParameter", ["attribute"]);
        }

        if (!parameters.aggr) {
            throw new error.BioInfError("error.MissingRequestParameter", ["aggregate"]);
        }

        if (!parameters.level) {
            throw new error.BioInfError("error.MissingRequestParameter", ["level"]);
        }

        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        var binSize = parseInt(parameters.binSize, 10);
        if (isNaN(binSize) || (binSize < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["binSize", parameters.binSize]);
        }

        var aggr = null;
        if (parameters.aggr.toLowerCase() === "min") {
            aggr = Math.min;
        }
        else if (parameters.aggr.toLowerCase() === "max") {
            aggr = Math.max;
        }
        else if (parameters.aggr.toLowerCase() === "avg") {
            aggr = function (left, right) { return left + right; };
        }

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::QuantitativeData");
        var results = await procedure(sampleListTableName, parameters.reference, null, 0, null, binSize, parameters.level, parameters.attr, parameters.aggr);
        var qData = [];
        if (results.WHITE_LIST_INVALID) {
            var result = results.WHITE_LIST_INVALID.split(" ");
            throw new error.BioInfError("error.InvalidParameter", [result[10], result[11]]);
        }
        var aggrScore = [];
        for (var rowIndex in results.$resultSets[0]) {
            var resultRow = results.$resultSets[0][rowIndex];
            while (qData.length <= resultRow.ChromosomeIndex) {
                qData.push([]);
                aggrScore.push([]);
            }
            qData[resultRow.ChromosomeIndex].push({
                score: resultRow.Score,
                binIndex: parseInt(resultRow.BinIndex)
            });
            aggrScore[resultRow.ChromosomeIndex] = aggrScore[resultRow.ChromosomeIndex] === undefined ? resultRow.Score : aggr(aggrScore[resultRow.ChromosomeIndex], resultRow.Score);
        }

        if (parameters.aggr.toLowerCase() === "avg") {
            for (var i = 0; i < aggrScore.length; i++) {
                aggrScore[i] /= qData[i].length;
            }
        }
        return { quantitativeData: qData, aggrScore: aggrScore, binSize: binSize };
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getQuantitativeDataOverview = getQuantitativeDataOverview;
    exports.getQuantitativeData = getQuantitativeData;

    exports.api = {
        getQuantitativeDataOverview: getQuantitativeDataOverview,
        getQuantitativeData: getQuantitativeData
    };

})(module.exports);
