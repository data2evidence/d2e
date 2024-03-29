(function (exports) {

    "use strict";

    let error = require(__base + "error");

    async function fullReload(context, parameters) {
    }

    async function init(context, parameters) {
        var referenceId = parameters.reference;
        if (referenceId === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        var chromosomeIndex = parseInt(parameters.chrom, 10);
        /*	if ( chromosomeIndex === undefined )
            {
                throw new BioInfError( "error.MissingRequestParameter", [ "chrom" ] );
            }*/
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }
        var begin = parseInt(parameters.begin, 10);
        /*	if ( begin === undefined )
            {
                throw new BioInfError( "error.MissingRequestParameter", [ "begin" ] );
            }*/
        if (isNaN(begin) || (begin < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["begin"]);
        }
        var end = parseInt(parameters.end, 10);
        /*if ( end === undefined )
        {
         throw new BioInfError( "error.MissingRequestParameter", [ "end" ] );
        }*/
        if (isNaN(end) || (end < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["end"]);
        }
        var featureClass = parameters.feat;
        if (featureClass === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["feat"]);
        }
        /*				    if ( isNaN( featureClass ) || ( featureClass < 0 ) )
        {
                throw new BioInfError( "error.MissingRequestParameter", [ "feat" ] );
        }*/
        var resultSet = await context.connection.executeQuery(
            'select "FeatureName", "Region.Begin" as "Begin", "Region.End" as "End", "Strand" from "hc.hph.genomics.db.models::Reference.Features" where "ReferenceID" = ? and "ChromosomeIndex" = ? and "Region.Begin" < ? and "Region.End" > ? and "Class" = ? order by "Region.Begin", "Region.End", "Class"',
            referenceId,
            chromosomeIndex,
            end,
            begin,
            featureClass
        );
        var features = [];
        for (var rowIndex in resultSet) {
            features.push({
                name: resultSet[rowIndex].FeatureName,
                begin: resultSet[rowIndex].Begin,
                end: resultSet[rowIndex].End,
                strand: resultSet[rowIndex].Strand
            });
        }

        return { features: features };
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.init = init;

    exports.api = {
        init: init
    };

})(module.exports);