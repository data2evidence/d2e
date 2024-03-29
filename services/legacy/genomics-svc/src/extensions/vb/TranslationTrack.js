(function (exports) {

    "use strict";

    var reference = require(__base + "reference");
    let error = require(__base + "error");

    async function fullReload(context, parameters) {
        var referenceId = parameters.reference;
        if (referenceId === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (chromosomeIndex === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }
        var begin = parseInt(parameters.begin, 10);
        if (begin === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["begin"]);
        }
        var end = parseInt(parameters.end, 10);
        if (end === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["end"]);
        }

        // find genes in specified region
        var genes = await reference.findGenes(context, referenceId, chromosomeIndex, begin, end, parameters.trans);

        return genes;
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.api = {
        fullReload: fullReload
    };

})(module.exports);