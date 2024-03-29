/**
 * @file Human Genome Variation Society (HGVS) notation support.
 */

(function (exports) {

    "use strict";

    let parser = require(__base + "hgvsParser");
    let reference = require(__base + "reference");
    let error = require(__base + "error");

    let complement = { "A": "T", "C": "G", "G": "C", "T": "A", "N": "N" };

    /**
     * Find features (gene, transcript, protein) with a given name and reference genome.
     *
     * @param {Object} context - The request context to be used.
     * @param {String} referenceId - The reference genome ID.
     * @param {String} featureName - The exact name of the feature.
     * 
     * @returns {Object} List of features with properties matching the query.
     */
    async function findExactFeatures(context, referenceId, featureName) {
        // try to find gene/transcript/protein
        var resultSet = await context.connection.executeQuery(
            "SELECT \"ChromosomeIndex\", \"Class\", MIN( \"Region.Begin\" ) AS \"Begin\", MAX( \"Region.End\" ) AS \"End\" FROM \"hc.hph.genomics.db.models::Reference.Features\" WHERE \"ReferenceID\" = ? AND UPPER( \"FeatureName\" ) = UPPER( ? ) AND \"Class\" IN ( 'gene', 'mRNA', 'CDS' ) GROUP BY \"ChromosomeIndex\", \"Class\"",
            referenceId,
            featureName
        );
        if (resultSet && (resultSet.length === 1)) {
            var overlappingGenes = await reference.findGenes(context, referenceId, resultSet[0].ChromosomeIndex, resultSet[0].Begin, resultSet[0].End, false);
            var selectedGenes = overlappingGenes.reduce(
                function (extractedGenes, gene) {
                    gene.featureClass = resultSet[0].Class;
                    gene.chromosomeIndex = resultSet[0].ChromosomeIndex;
                    if (gene.name.toUpperCase() === featureName.toUpperCase()) {
                        extractedGenes.push(gene);
                    }
                    else if (Array.isArray(gene.translations)) {
                        gene.translations = gene.translations.filter(
                            function (translation) {
                                return (translation.name.toUpperCase() === featureName.toUpperCase()) || (translation.protein.toUpperCase() === featureName.toUpperCase());
                            }
                        );
                        if (gene.translations.length > 0) {
                            extractedGenes.push(gene);
                        }
                    }
                    return extractedGenes;
                },
                []
            );
            return selectedGenes;
        }
        return null;
    }

    /**
     * Find a unique feature (gene, transcript, protein, chromosome) with a given name/synonym and reference genome.
     *
     * @param {Object} context - The request context to be used.
     * @param {String} referenceId - The reference genome ID.
     * @param {String} featureName - The name or synonym of the feature/chromosome.
     * 
     * @returns {Object} Properties of feature matching the query or null if not found/ambiguous.
     */
    async function findFeature(context, referenceId, featureName) {
        // try to find feature
        var features = await findExactFeatures(context, referenceId, featureName);

        if (features && (features.length > 0)) {
            if (features.length === 1) {
                return features[0];
            }
            else {
                context.trace.debug("Multiple genes found");
                return null;
            }
        }
        else // see if there are any synonyms for the requested gene
        {
            var synonyms = await reference.resolveGeneSynonym(context, featureName);
            if (synonyms.length === 1) {
                featureName = synonyms[0];
            }
            else if (synonyms.length > 1) {
                context.trace.debug("Gene synonym ambiguous");
                return null;
            }

            features = await findExactFeatures(context, referenceId, featureName);

            if (features && (features.length > 0)) {
                if (features.length === 1) {
                    return features[0];
                }
                else {
                    context.trace.debug("Multiple genes found after synonym resolution");
                    return null;
                }
            }
        }

        // try to find chromosome with exact name
        var resultSet = await context.connection.executeQuery(
            "SELECT \"ChromosomeName\", \"ChromosomeIndex\", \"Size\" FROM \"hc.hph.genomics.db.models::Reference.Chromosomes\" WHERE \"ReferenceID\" = ? AND UPPER( \"ChromosomeName\" ) = UPPER( ? ) OR 'CHR' || UPPER( \"ChromosomeName\" ) = UPPER( ? ) OR UPPER( \"ChromosomeName\" ) = 'CHR' || UPPER( ? )",
            referenceId,
            featureName,
            featureName,
            featureName
        );
        if (resultSet && (resultSet.length === 1)) {
            return { name: resultSet[0].ChromosomeName, featureClass: "chromosome", chromosomeIndex: resultSet[0].ChromosomeIndex, begin: 0, end: resultSet[0].Size, strand: "+" };
        }

        context.trace.debug("Could not find a uniquely matching feature or chromosome");
        return null;
    }

    /**
     * Split the translation into CDS and UTRs.
     *
     * @param {Array} translation - List of regions within translation.
     * @param {Boolean} reverseStrand - Reverse strand.
     * 
     * @returns {Object} Translation split into CDS and UTRs.
     */
    function splitTranslation(translation, reverseStrand) {
        var result = { utr5: [], cds: [], utr3: [] };
        (reverseStrand ? translation.segments.reverse() : translation.segments).forEach(
            function (segment) {
                if (segment.phase !== undefined) {
                    result.cds.push(segment);
                }
                else if (result.cds.length === 0) {
                    result.utr5.push(segment);
                }
                else {
                    result.utr3.push(segment);
                }
            }
        );
        result.utr5 = result.utr5.reverse();
        return result;
    }

    /**
     * Convert the location from CDS/UTR/Protein coordinates to genomic coordinates.
     *
     * @param {Object} translation - Translation split into CDS and UTRs.
     * @param {Object} location - The location as reported from the parser.
     * @param {Boolean} reverseStrand - Reverse strand.
     * 
     * @returns {Number} The 0-based genomic position.
     */
    function convertLocation(translation, location, reverseStrand) {
        var segmentIndex;
        var offset = 0;
        var relativePosition;
        switch (location.coordinates) {
            case "5'UTR":
                relativePosition = location.position;
                for (segmentIndex = 0; (segmentIndex < translation.utr5.length) && (relativePosition >= (translation.utr5[segmentIndex].end - translation.utr5[segmentIndex].begin)); ++segmentIndex) {
                    relativePosition -= (translation.utr5[segmentIndex].end - translation.utr5[segmentIndex].begin);
                }
                if (segmentIndex < translation.utr5.length) {
                    return reverseStrand ? translation.utr5[segmentIndex].begin + relativePosition + 1 : translation.utr5[segmentIndex].end - relativePosition - 1;
                }
                else {
                    return null;
                }
            case "protein":
                relativePosition = location.position * 3;
                for (segmentIndex = 0; (segmentIndex < translation.cds.length) && (relativePosition >= (translation.cds[segmentIndex].end - translation.cds[segmentIndex].begin)); ++segmentIndex) {
                    relativePosition -= (translation.cds[segmentIndex].end - translation.cds[segmentIndex].begin);
                }
                if (segmentIndex < translation.cds.length) {
                    return reverseStrand ? translation.cds[segmentIndex].end - relativePosition : translation.cds[segmentIndex].begin + relativePosition;
                }
                else {
                    return null;
                }
            case "CDS":
            case undefined:
                offset = location.offset ? location.offset : 0;
                relativePosition = location.position;
                for (segmentIndex = 0; (segmentIndex < translation.cds.length) && (relativePosition >= (translation.cds[segmentIndex].end - translation.cds[segmentIndex].begin)); ++segmentIndex) {
                    relativePosition -= (translation.cds[segmentIndex].end - translation.cds[segmentIndex].begin);
                }
                if (segmentIndex < translation.cds.length) {
                    return reverseStrand ? translation.cds[segmentIndex].end - relativePosition - offset : translation.cds[segmentIndex].begin + relativePosition + offset;
                }
                else {
                    return null;
                }
            case "3'UTR":
                relativePosition = location.position;
                for (segmentIndex = 0; (segmentIndex < translation.utr3.length) && (relativePosition >= (translation.utr3[segmentIndex].end - translation.utr3[segmentIndex].begin)); ++segmentIndex) {
                    relativePosition -= (translation.utr3[segmentIndex].end - translation.utr3[segmentIndex].begin);
                }
                if (segmentIndex < translation.utr3.length) {
                    return reverseStrand ? translation.utr3[segmentIndex].end - relativePosition : translation.utr3[segmentIndex].begin + relativePosition;
                }
                else {
                    return null;
                }
            default:
                throw new error.BioInfError("error.Internal", location.coordinates, "Unexpected coordinate system");
        }
    }

    /**
     * Complete information returned by the parser using backend data and remove unnecessary information.
     *
     * @param {Object} context - The request context to be used.
     * @param {String} referenceId - The reference genome ID.
     * @param {Object} parseResult - The location information as returned by the parser with the coordinate systen, position and optionally offsets.
     * 
     * @returns {Aray} Array of objects with chromosome index and absolute begin and end within chromosome as well as alleles if known.
     */
    async function complete(context, referenceId, parseResult) {
        var results = [];
        var feature = await findFeature(context, referenceId, parseResult.feature);
        var reverseStrand = false;
        if (!feature) // feature not found or not unique
        {
            results = [];
        }
        else if ((feature.featureClass === "chromosome") || (parseResult.location && (parseResult.location.begin.coordinates === "genomic") && (parseResult.location.end.coordinates === "genomic"))) // chromosome coordinates
        {
            if (parseResult.location) {
                results = [{ chromosomeIndex: feature.chromosomeIndex, begin: feature.begin + Math.min(parseResult.location.begin.position, parseResult.location.end.position), end: feature.begin + Math.max(parseResult.location.begin.position, parseResult.location.end.position) }];
            }
            else {
                results = [{ chromosomeIndex: feature.chromosomeIndex, begin: feature.begin, end: feature.end }];
            }
        }
        else if (parseResult.location) // CDS/UTR/protein coordinates
        {
            reverseStrand = (feature.strand === "-");
            results = feature.translations.reduce(
                function (translationResults, translation) {
                    var translationRegions = splitTranslation(translation, reverseStrand);
                    var begin = convertLocation(translationRegions, parseResult.location.begin, reverseStrand);
                    var end = parseResult.location.end ? convertLocation(translationRegions, parseResult.location.end, reverseStrand) : begin + 1;
                    var key = feature.chromosomeIndex + ":" + Math.min(begin, end) + "_" + Math.max(begin, end);
                    if (!translationResults.hasOwnProperty(key)) {
                        translationResults[key] = { chromosomeIndex: feature.chromosomeIndex, begin: Math.min(begin, end), end: Math.max(begin, end), canonical: translation.cdsLength === feature.translations[0].cdsLength };
                    }
                    return translationResults;
                },
                {}
            );
            results = Object.keys(results).map(function (key) { return results[key]; });
        }
        else // bare feature
        {
            results = [{ chromosomeIndex: feature.chromosomeIndex, begin: feature.begin, end: feature.end }];
        }

        if (parseResult.location) // add allele information from parser output
        {
            results.forEach(
                function (result) {
                    if (parseResult.referenceAllele !== undefined) {
                        result.referenceAllele = reverseStrand ? Array.from(parseResult.referenceAllele).reduce(function (allele, nucleotide) { return complement[nucleotide] + allele; }, "") : parseResult.referenceAllele;
                    }
                    if (parseResult.alternativeAllele !== undefined) {
                        result.alternativeAllele = reverseStrand ? Array.from(parseResult.alternativeAllele).reduce(function (allele, nucleotide) { return complement[nucleotide] + allele; }, "") : parseResult.alternativeAllele;
                    }
                    if (parseResult.referenceAminoAcid !== undefined) {
                        result.referenceAminoAcid = parseResult.referenceAminoAcid;
                    }
                    if (parseResult.alternativeAminoAcid !== undefined) {
                        result.alternativeAminoAcid = parseResult.alternativeAminoAcid;
                    }
                }
            );
        }

        return results;
    }

    /**
     * Parse HGVS notation and return absolute genomic coordinates of the variant.
     *
     * @param {Object} context - The request context to be used.
     * @param {String} referenceId - The reference genome ID.
     * @param {String} locationString - The variant information in HGVS format.
     * 
     * @returns {Object} Chromosome index and absolute begin and end within chromosome as well as alleles if known.
     */
    function locate(context, referenceId, locationString) {
        return complete(context, referenceId, parser.parse(locationString));
    }

    // public API - everything in exports will be accessible from other libraries

    exports.locate = locate;

})(module.exports);
