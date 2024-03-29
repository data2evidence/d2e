(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let uuid = require('uuid/v1');
    let hgvsNotation = require(__base + "hgvsNotation");
    let oGeneral = require(__base + "extensions/vb/General");
    let auditLib = require(__base + "auditLog");

    async function loadFeatures(context, parameters) {
        if (parameters.reference === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }

        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }

        var position = parseInt(parameters.position, 10);
        if (isNaN(position)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["position"]);
        }

        var resultSet = await context.connection
            .executeQuery(
                'select "Class", "FeatureName", "hc.hph.genomics.db.functions::StripNullBytes"( "Description" ) as "Description" from "hc.hph.genomics.db.models::Reference.Features" where "ReferenceID" = ? and "ChromosomeIndex" = ? and ? between "Region.Begin" and "Region.End"-1 and "Class" not in ( \'chromosome\', \'centromere\' )',
                parameters.reference, chromosomeIndex, position);
        var features = {};
        for (var rowIndex in resultSet) {
            var featureClass = resultSet[rowIndex].Class;

            if (!features.hasOwnProperty(featureClass)) {
                features[featureClass] = [];
            }
            features[featureClass].push({
                name: resultSet[rowIndex].FeatureName,
                description: resultSet[rowIndex].Description
            });
        }
        return features;
    }

    async function loadReferenceAllele(context, parameters) {
        if (parameters.reference === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }
        var position = parseInt(parameters.position, 10);
        if (isNaN(position)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["position"]);
        }

        var resultSet = await context.connection.executeQuery('select "Region.Begin" as "Begin", "Sequence" from "hc.hph.genomics.db.models::Reference.Sequences" where "ReferenceID" = ? and "ChromosomeIndex" = ? and ? between "Region.Begin" and "Region.End"-1', parameters.reference, chromosomeIndex, position);
        if (resultSet.length === 1) {
            var sequenceBegin = resultSet[0].Begin;
            var sequence = resultSet[0].Sequence;
            return {
                label: sequence[position - sequenceBegin],
                value: 1.0
            };
        } else if (resultSet.length === 0) {
            throw new error.BioInfError("error.CouldNotDetermine", ["reference allele"]);
        } else {
            throw new error.BioInfError("error.Ambiguous", ["reference allele"]);
        }
    }

    async function loadAlleleFrequencies(context, parameters) {
        var chromosomeIndex = parseInt(parameters.chrom, 10);
        if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }
        var position = parseInt(parameters.position, 10);
        if (isNaN(position)) {
            throw new error.BioInfError("error.MissingRequestParameter", ["position"]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        var alleles = [await loadReferenceAllele(context, parameters)];

        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::DisplayVariants");
        var emptyIntermediateResult = await context.connection.executeQuery('SELECT  "DWAuditID",  "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
        var resultSet = (await procedure(sampleListTableName, emptyIntermediateResult, chromosomeIndex, position, position + 1)).DISPLAY_VARIANTS;
        for (var rowIndex in resultSet) {
            var allele = resultSet[rowIndex].Allele;
            if (allele !== alleles[0].label) {
                var freq = resultSet[rowIndex].AlleleCount / resultSet[rowIndex].CopyNumber;
                alleles.push({
                    label: (allele ? allele : '-'),
                    value: freq
                });
                alleles[0].value -= freq;
            }
        }

        // Log accessed attributes
        await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
            {name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex ",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.Variants.Position ",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele ",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount ",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.Genotypes.CopyNumber ",successful:true}
        ]);
        return alleles;
    }

    async function getAlleles(context, parameters) {

        var aSampleIds = [], outAlleles = {};
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.model::SampleNames");
        var resultSet = (await procedure(sampleListTableName)).SAMPLE_NAMES;
        for (var rowIndex in resultSet) {
            aSampleIds.push(resultSet[rowIndex].SampleIndex);
        }
        parameters.sampleIdx = aSampleIds;
        var oHgvsGenerator = new hgvsNotation.Generator(context);
        var output = await oHgvsGenerator.getVariantDetails(parameters);
        if (output) {
            outAlleles = oHgvsGenerator.getVariantDetailsForPopOver(output);
        }

         // Log accessed attributes
         await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.DWAuditID",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.VariantIndex","successful":true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.AlleleIndex",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.ChromosomeIndex",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.Position",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.GeneName",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.Region",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.SequenceAlteration",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.AminoAcid.Reference",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.AminoAcid.Alternative",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.MutationType",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.CDSPosition",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.Transcript",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.Protein",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAnnotations.ExonRank",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele",successful:true},
            {name: "hc.hph.genomics.db.models::SNV.VariantIDs.VariantID",successful:true}
        ]);
        return outAlleles;
    }

    function getAlleleDetails(context, parameters) {
        var ids = Object.keys(parameters.alleles.reduce(
            function (aIds, oAllele) {
                oAllele.VariantIdList.forEach(function (oObj) {
                    if (oObj.VariantID) {
                        aIds[oObj.VariantID] = true;
                    }
                });
                return aIds;
            },
            {}
        ));
        return parameters.alleles.map(function (oAllele) {
            return { ids: ids, transcriptAnnotations: oAllele.transcriptAnnotations };
        });
    }

    async function getAlleleLocations(context, parameters) {
        var chromosomeName = null;
        var resultSet = await context.connection.executeQuery("select \"ChromosomeName\" from \"hc.hph.genomics.db.models::Reference.Chromosomes\" where \"ReferenceID\" = ? and \"ChromosomeIndex\" = ?", parameters.reference, parameters.chrom);
        if (resultSet && resultSet.length === 1) {
            chromosomeName = resultSet[0].ChromosomeName;
        }
        if (chromosomeName && (chromosomeName.substring(0, 3) !== "chr")) {
            chromosomeName = "chr" + chromosomeName;
        }
        return parameters.alleles.map(function (oAllele) {
            return {
                location: chromosomeName ? chromosomeName + ":" + (parameters.position + 1) + "-" + (parameters.position + 1) : null
            };
        });
    }

    function getGeneDescriptions(context, parameters) {

        if (parameters.reference === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }

        return parameters.genes
            .map(async function (oGene) {
                var result = await context.connection.executeQuery("select CAST( \"LongDescription\" AS VARCHAR ) AS \"LongDescription\" from \"hc.hph.genomics.db.models::Reference.Features\" where \"ReferenceID\" = ? and \"ChromosomeIndex\" = ? and \"FeatureName\" = ?", parameters.reference, chromosome, oGene.name);
                return {
                    description: Array.from(result).reduce(function (sDescription, oRow) { return sDescription ? sDescription : oRow.LongDescription; }, null)
                };
            });
    }

    function getGeneNames(context, parameters) {
        return parameters.genes.map(function (oGene) {
            return {
                name: oGene.name
            };
        });
    }

    async function getGenes(context, parameters) {
        // error checks
        if (parameters.reference === undefined) {
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
        // get the Data from the tables (Features table + TypedTerms view)
        var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::GeneData");
        var result = await procedure(parameters.reference, chromosome, position);
        var genes = [];
        for (var rowIndex in result.GENEATTRIBUTES) {
            var resultRow = result.GENEATTRIBUTES[rowIndex];
            var gene;
            if ((genes.length === 0) || (genes[genes.length - 1].name !== resultRow.GeneName)) {
                gene = {
                    name: resultRow.GeneName,
                    description: resultRow.Description,
                    aliases: []
                };
                genes.push(gene);
            }
            else {
                gene = genes[genes.length - 1];
            }
            if (resultRow.Synonym) {
                gene.aliases.push(resultRow.Synonym);
            }
        }
        return { genes: genes };
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getAlleles = getAlleles;
    exports.getAlleleLocations = getAlleleLocations;
    exports.getAlleleDetails = getAlleleDetails;
    exports.getGenes = getGenes;
    exports.getGeneNames = getGeneNames;
    exports.getGeneDescriptions = getGeneDescriptions;
    exports.loadFeatures = loadFeatures;
    exports.loadReferenceAllele = loadReferenceAllele;
    exports.loadAlleleFrequencies = loadAlleleFrequencies;

    exports.api = {
        getAlleles: getAlleles,
        getAlleleLocations: getAlleleLocations,
        getAlleleDetails: getAlleleDetails,
        getGenes: getGenes,
        getGeneNames: getGeneNames,
        getGeneDescriptions: getGeneDescriptions
    };

})(module.exports);