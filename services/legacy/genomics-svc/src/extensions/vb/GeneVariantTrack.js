(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let general = require(__base + "extensions/vb/General");
    let auditLib = require(__base + "auditLog");

    async function fullReload(context, parameters) {
        return getGeneVariants(context, parameters);
    }

    async function init(context, parameters) {
        return getGeneVariants(context, parameters);
    }

    async function getGeneVariants(context, parameters) {
        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }
        /*
        var begin = parseInt( parameters.begin, 10 );
        if ( isNaN( begin ) || ( begin < 0 ) )
        {
            throw new BioInfError( "error.InvalidParameter", [ "begin",  parameters.begin ] );
        }
        var end = parseInt( parameters.end, 10 );
        if ( isNaN( end ) || ( end < begin ) )
        {
            throw new BioInfError( "error.InvalidParameter", [ "end",  parameters.end ] );
        }
        */
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await context.getExtension("vb.General.getAnnotationGrouping")(parameters);
        //If Variant Browser is configured regarding grouping
        if (annotationGrouping) {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantAnnotationCounts");

            var results = await procedure(parameters.sampleListTableName, annotationGrouping.intermediateResults, parameters.reference, chromosome, 0, null, parameters.annotationConfig.groupConfig.binSize, 1);
            var iCategoryCount = annotationGrouping.categoryCount;

            var categories = {};

            var y0 = 0;
            for (var rowIndex in results.GENE_VARIANT_COUNTS) {
                var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
                if (resultRow.Count > 0) {
                    if (!categories[resultRow.GeneName]) {
                        y0 = 0;
                        categories[resultRow.GeneName] = {};
                        categories[resultRow.GeneName][resultRow.Grouping] = {};

                        categories[resultRow.GeneName][resultRow.Grouping] = {
                            begin: resultRow.Begin,
                            end: resultRow.End,
                            fraction: ((resultRow.Count / results.SAMPLE_COUNT))
                        };
                        y0 += ((resultRow.Count / results.SAMPLE_COUNT));
                    } else {
                        if (!categories[resultRow.GeneName][resultRow.Grouping]) {
                            categories[resultRow.GeneName][resultRow.Grouping] = {};
                            categories[resultRow.GeneName][resultRow.Grouping] = {
                                begin: resultRow.Begin,
                                end: resultRow.End,
                                fraction: ((resultRow.Count / results.SAMPLE_COUNT))
                            };
                            y0 += ((resultRow.Count / results.SAMPLE_COUNT));
                        }
                    }
                }
            }
            // Log read access
           await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
            ], false, parameters.annotationConfig.groupConfig);
            return { categories: categories, sampleCount: results.SAMPLE_COUNT };
        } else {
            //Variant Browser is not configured. Request all variants
            var procedure, results;
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await general.getGenomicFilterData(context, parameters);
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantAnnotationCounts");
                results = await procedure(parameters.sampleListTableName, genomicFilterResult.intermediateResults, parameters.reference, chromosome, 0, null, 1, 1); //binSize =1 as parameters dont have value 
            } else {
                procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantAnnotationCounts");
                var emptyIntermediateResult = await context.connection.executeQuery('SELECT  "DWAuditID",  "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
                results = await procedure(parameters.sampleListTableName, emptyIntermediateResult, parameters.reference, chromosome, 0, null, 1, 0);//binSize = 1 as parameters dont have value  
            }
            var genes = [];
            for (var rowIndex in results.GENE_VARIANT_COUNTS) {
                var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
                if (resultRow.Count > 0) {
                    genes.push({
                        begin: resultRow.Begin,
                        end: resultRow.End,
                        fraction: resultRow.Count / results.SAMPLE_COUNT
                    });
                }
            }
           // Log read access
           await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
        ]);
            return { genes: genes, sampleCount: results.SAMPLE_COUNT };
        }
    }

    async function getGeneVariantsOverview(context, parameters) {
        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await context.getExtension("vb.General.getAnnotationGrouping")(parameters);

        if (annotationGrouping) {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantAnnotationCounts");
            var results = await procedure(parameters.sampleListTableName, annotationGrouping.intermediateResults, parameters.reference, null, 0, null, parameters.annotationConfig.groupConfig.binSize, 1);
            var categoryCount = annotationGrouping.categoryCount;

            var genes = {};
            var result = [];
            for (var rowIndex in results.GENE_VARIANT_COUNTS) {
                var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
                while (result.length <= resultRow.ChromosomeIndex) {
                    result.push([]);
                }
                if (resultRow.Count > 0) {
                    if (!genes[resultRow.ChromosomeIndex]) {
                        genes[resultRow.ChromosomeIndex] = [];
                        genes[resultRow.ChromosomeIndex].push({
                            gene: resultRow.GeneName,
                            begin: resultRow.Begin,
                            end: resultRow.End,
                            fraction: (resultRow.Count / results.SAMPLE_COUNT),
                            category: resultRow.Grouping,
                            bin: resultRow.Bin
                        });
                    } else {
                        genes[resultRow.ChromosomeIndex].push({
                            gene: resultRow.GeneName,
                            begin: resultRow.Begin,
                            end: resultRow.End,
                            fraction: (resultRow.Count / results.SAMPLE_COUNT),
                            category: resultRow.Grouping,
                            bin: resultRow.Bin
                        });
                    }
                }
            }
            // Log read access
           await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
            ], false, parameters.annotationConfig.groupConfig);
            return { genes: genes, sampleCount: results.SAMPLE_COUNT };

        } else {
            //Variant Browser is not configured. Send empty grouping table as parameter
            var procedure, results, iBinSize = 1;
            if (parameters.hasOwnProperty("binSize") && parameters.binSize > 0) {
                iBinSize = parameters.binSize;
            }
            procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantAnnotationCounts");
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await general.getGenomicFilterData(context, parameters);
                results = await procedure(parameters.sampleListTableName, genomicFilterResult.intermediateResults, parameters.reference, null, 0, null, iBinSize, 1);
            } else {
                var emptyIntermediateResult = await context.connection.executeQuery('SELECT "DWAuditID", "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
                results = await procedure(parameters.sampleListTableName, emptyIntermediateResult, parameters.reference, null, 0, null, iBinSize, 0);
            }

            var result = [];
            for (var rowIndex in results.GENE_VARIANT_COUNTS) {
                var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
                while (result.length <= resultRow.ChromosomeIndex) {
                    result.push([]);
                }
                if (resultRow.Count > 0) {
                    result[resultRow.ChromosomeIndex].push({
                        begin: resultRow.Begin,
                        end: resultRow.End,
                        fraction: resultRow.Count / results.SAMPLE_COUNT
                    });
                }
            }
           // Log read access
           await auditLib.logAttributes( context, parameters.sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
        ]);
            return { genes: result, sampleCount: results.SAMPLE_COUNT };
        }
    }

    async function getGeneSiteTrack(context, parameters) {
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

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneVariantCounts");
        var results = await procedure(sampleListTableName, parameters.reference, chromosome, position, position + 1);

        var geneVariants = [];
        for (var rowIndex in results.GENE_VARIANT_COUNTS) {
            var resultRow = results.GENE_VARIANT_COUNTS[rowIndex];
            geneVariants.push({
                geneName: resultRow.GeneName,
                count: resultRow.Count
            });
        }
        // Log read access
        await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
            { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.FeatureName", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.Begin", successful: true },
            { name: "hc.hph.genomics.db.models::Reference.Features.Region.End", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.ReferenceAlleleCount", successful: true },
            { name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber", successful: true },
        ]);
        return { geneVariant: geneVariants, sampleCount: results.SAMPLE_COUNT };
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.init = init;
    exports.getGeneVariantsOverview = getGeneVariantsOverview;
    exports.getGeneVariants = getGeneVariants;
    exports.getGeneSiteTrack = getGeneSiteTrack;

    exports.api = {
        init: init,
        getGeneVariantsOverview: getGeneVariantsOverview,
        getGeneVariants: getGeneVariants,
        getGeneSiteTrack: getGeneSiteTrack
    };

})(module.exports);