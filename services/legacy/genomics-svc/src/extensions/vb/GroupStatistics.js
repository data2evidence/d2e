(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let auditLib = require(__base + "auditLog");
    let oGeneral = require(__base + "extensions/vb/General");

    async function getGeneStats(context, parameters) {
        var referenceId = parameters.reference;
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
        parameters = await extensions.mergeParameters(parameters, {
            trackParameters: {}, groupsParameters: {}, groupsRequest: parameters.dataPlugin,
            mergeGroup: true, mergeGroupPlugin: "vb.GroupStatistics.mergeGeneGroup", "trackRequest": "vb.GroupStatistics.getAffectedGeneCount"
        });
        parameters.trackParameters = await extensions.mergeParameters(parameters.trackParameters, { reference: referenceId, chromosome: chromosome, position: position, dataset: parameters.dataset });
        parameters.groupsParameters = await extensions.mergeParameters(parameters.groupsParameters, parameters);
        return await context.getExtension("vb.TrackGroups.load")(parameters);
    }

    async function getAffectedGeneCount(context, parameters) {
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantCounts");
        var results = await procedure(sampleListTableName, parameters.reference, parameters.chromosome, parameters.position, parameters.position + 1);
        var geneVariants = [];
        for (var rowIndex in results.GENE_VARIANT_COUNTS) {
            var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
            geneVariants.push({
                geneName: resultRow.GeneName,
                affectedCount: resultRow.Count,
                totalCount: results.SAMPLE_COUNT
            });
        }
        // Log read access
        await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
        ]);
        return { geneVariant: geneVariants };
    }

    async function mergeGeneGroup(context, parameters, groupResult) {
        return await parameters.genes.map(function (oGene) {
            var oStatistics = { statistics: [] };
            for (var iGroup in groupResult) {
                var oGeneVariant = groupResult[iGroup].result.geneVariant;
                oStatistics.statistics.push({
                    name: groupResult[iGroup].name,
                    affectedCount: 0,
                    totalCount: 0
                });
                var length = oStatistics.statistics.length;
                for (var iGene in oGeneVariant) {
                    if (oGeneVariant[iGene].geneName === oGene.name) {
                        oStatistics.statistics[length - 1].affectedCount = oGeneVariant[iGene].affectedCount;
                        oStatistics.statistics[length - 1].totalCount = oGeneVariant[iGene].totalCount;
                        break;
                    }
                }
            }
            return oStatistics;
        });
    }

    async function getAlleleStats(context, parameters) {
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
        parameters = await extensions.mergeParameters(parameters, {
            trackParameters: {}, groupsParameters: {}, groupsRequest: parameters.dataPlugin,
            mergeGroup: true, mergeGroupPlugin: "vb.GroupStatistics.mergeAlleleGroup", "trackRequest": "vb.GroupStatistics.getAffectedAlleleCount"
        });
        parameters.trackParameters = await extensions.mergeParameters(parameters.trackParameters, { chromosome: chromosome, position: position, dataset: parameters.dataset, alleles: parameters.alleles });
        parameters.groupsParameters = await extensions.mergeParameters(parameters.groupsParameters, parameters);
        return await context.getExtension("vb.TrackGroups.load")(parameters);
    }

    async function getAffectedAlleleCount(context, parameters) {
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::AlleleStatistics");
         // Log read access
         await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele", successful: true }
        ]);
        return await Promise.all( parameters.alleles.map(function (oAllele) {
            return procedure(sampleListTableName, parameters.chromosome, parameters.position, oAllele.sequence)
                .then( results => {
                    return {
                        name: "",
                        affectedCount: results.AFFECTED_COUNT,
                        totalCount: results.SAMPLE_COUNT
                    };
                } )
        }) );
    }

    async function mergeAlleleGroup(context, parameters, groupResult) {
        var alleleList = [];
        if (groupResult.length > 0) {
            var iResultLength = groupResult[0].result.length;
            for (var iResult = 0; iResult < iResultLength; iResult++) {
                alleleList.push({ statistics: [] });
                for (var iGroupResult = 0; iGroupResult < groupResult.length; iGroupResult++) {
                    groupResult[iGroupResult].result[iResult].name = groupResult[iGroupResult].name;
                    alleleList[iResult].statistics.push(groupResult[iGroupResult].result[iResult]);
                }
            }
        }
        return alleleList;
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getAlleleStats = getAlleleStats;
    exports.getAffectedAlleleCount = getAffectedAlleleCount;
    exports.mergeAlleleGroup = mergeAlleleGroup;
    exports.getGeneStats = getGeneStats;
    exports.getAffectedGeneCount = getAffectedGeneCount;
    exports.mergeGeneGroup = mergeGeneGroup;

    exports.api = {
        getAlleleStats: getAlleleStats,
        getAffectedAlleleCount: getAffectedAlleleCount,
        mergeAlleleGroup: mergeAlleleGroup,
        getGeneStats: getGeneStats,
        getAffectedGeneCount: getAffectedGeneCount,
        mergeGeneGroup: mergeGeneGroup
    };

})(module.exports);