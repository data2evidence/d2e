/**
 * @file Reference genome related functionality.
 */

(function (exports) {

	"use strict";

	var error = require(__base + "error");

	async function resolveGeneSynonym(context, synonym) {
		return Array.from(await context.connection.executeQuery("SELECT DISTINCT symbols.\"TermText\" FROM \"hc.hph.ots::Views.ConceptTerms\" AS synonyms INNER JOIN \"hc.hph.ots::Views.ConceptTerms\" AS symbols ON symbols.\"ConceptCode\" = synonyms.\"ConceptCode\" WHERE symbols.\"ConceptVocabularyID\" = 'ots.NCBI.GENE' AND synonyms.\"ConceptVocabularyID\" = 'ots.NCBI.GENE' AND symbols.\"TermType\" = 'symbol' AND synonyms.\"TermType\" = 'synonym' AND UPPER( synonyms.\"TermText\" ) = UPPER( ? )", synonym))
		.map(function (row) { return row.TermText; });
	}

	async function loadReferenceSequence(context, referenceId, chromosomeIndex, begin, end) {
		var resultSet;
		var rowIndex;

		// obtain reference sequence
		var sequence = [];
		resultSet = await context.connection.executeQuery(
			"SELECT \"Region.Begin\" AS \"Begin\", UPPER( \"Sequence\" ) AS \"Sequence\" FROM \"hc.hph.genomics.db.models::Reference.Sequences\" WHERE \"ReferenceID\" = ? AND \"ChromosomeIndex\" = ? AND \"Region.End\" > ? AND \"Region.Begin\" < ? ORDER BY \"Region.Begin\"",
			referenceId,
			chromosomeIndex,
			begin,
			end
		);
		var sequenceBuffer = "";
		var sequenceBufferEnd = begin;
		for (rowIndex in resultSet) {
			var segmentBegin = resultSet[rowIndex].Begin;
			var segmentSequence = resultSet[rowIndex].Sequence;
			if (segmentBegin <= sequenceBufferEnd) {
				sequenceBuffer += segmentSequence.substr(sequenceBufferEnd - segmentBegin);
				if (sequenceBuffer.length >= 1024) {
					sequence.push(sequenceBuffer.substr(0, 1024));
					sequenceBuffer = sequenceBuffer.substr(1024);
				}
			}
			else {
				for (; sequenceBufferEnd < segmentBegin; ++sequenceBufferEnd) {
					sequenceBuffer += "N";
					if (sequenceBuffer.length >= 1024) {
						sequence.push(sequenceBuffer.substr(0, 1024));
						sequenceBuffer = sequenceBuffer.substr(1024);
					}
				}
				sequenceBuffer += segmentSequence;
				if (sequenceBuffer.length >= 1024) {
					sequence.push(sequenceBuffer.substr(0, 1024));
					sequenceBuffer = sequenceBuffer.substr(1024);
				}
			}
			sequenceBufferEnd = segmentBegin + segmentSequence.length;
		}
		for (; sequenceBufferEnd < end; ++sequenceBufferEnd) {
			sequenceBuffer += "N";
			if (sequenceBuffer.length >= 1024) {
				sequence.push(sequenceBuffer.substr(0, 1024));
				sequenceBuffer = sequenceBuffer.substr(1024);
			}
		}
		while (sequenceBuffer.length >= 1024) {
			sequence.push(sequenceBuffer.substr(0, 1024));
			sequenceBuffer = sequenceBuffer.substr(1024);
		}
		if (sequenceBuffer) {
			sequence.push(sequenceBuffer.substr(0, (end - begin) % 1024));
		}

		return sequence;
	}

	async function loadAminoAcidSequence(context, referenceId, chromosomeIndex, begin, end, translate) {
		var resultSet;
		var rowIndex;

		// get information for translation
		var sequence = {
			begin: begin - 2,
			end: end + 2
		};

		if (translate) {
			var content = await loadReferenceSequence(context, referenceId, chromosomeIndex, sequence.begin, sequence.end);

			// obtain amino acid translations
			resultSet = await context.connection.executeQuery(
				"SELECT \"Codon\", \"AminoAcid\" FROM \"hc.hph.genomics.db.models::Reference.Codons\" WHERE \"ReferenceID\" = ? AND \"ChromosomeIndex\" = ?",
				referenceId,
				chromosomeIndex
			);
			sequence.aminoAcidMap = {};
			for (rowIndex in resultSet) {
				sequence.aminoAcidMap[resultSet[rowIndex].Codon] = resultSet[rowIndex].AminoAcid;
			}

			var reverseComplement = {
				"AAA": "TTT", "AAC": "GTT", "AAG": "CTT", "AAT": "ATT", "ACA": "TGT", "ACC": "GGT", "ACG": "CGT", "ACT": "AGT", "AGA": "TCT", "AGC": "GCT", "AGG": "CCT", "AGT": "ACT", "ATA": "TAT", "ATC": "GAT", "ATG": "CAT", "ATT": "AAT",
				"CAA": "TTG", "CAC": "GTG", "CAG": "CTG", "CAT": "ATG", "CCA": "TGG", "CCC": "GGG", "CCG": "CGG", "CCT": "AGG", "CGA": "TCG", "CGC": "GCG", "CGG": "CCG", "CGT": "ACG", "CTA": "TAG", "CTC": "GAG", "CTG": "CAG", "CTT": "AAG",
				"GAA": "TTC", "GAC": "GTC", "GAG": "CTC", "GAT": "ATC", "GCA": "TGC", "GCC": "GGC", "GCG": "CGC", "GCT": "AGC", "GGA": "TCC", "GGC": "GCC", "GGG": "CCC", "GGT": "ACC", "GTA": "TAC", "GTC": "GAC", "GTG": "CAC", "GTT": "AAC",
				"TAA": "TTA", "TAC": "GTA", "TAG": "CTA", "TAT": "ATA", "TCA": "TGA", "TCC": "GGA", "TCG": "CGA", "TCT": "AGA", "TGA": "TCA", "TGC": "GCA", "TGG": "CCA", "TGT": "ACA", "TTA": "TAA", "TTC": "GAA", "TTG": "CAA", "TTT": "AAA"
			};

			sequence.get = function (begin, end) {
				if ((begin >= this.begin) && (end <= this.end) && ((end - begin) <= 1024)) {
					var index = Math.floor((begin - this.begin) / 1024);
					var nucleotideSequence = content[index].substr((begin - this.begin) % 1024, end - begin);
					if ((nucleotideSequence.length < (end - begin)) && ((index + 1) < content.length)) {
						nucleotideSequence += content[index + 1].substr(0, end - begin - nucleotideSequence.length);
					}
					return nucleotideSequence;
				}
				else {
					return Array(end - begin).join("?");
				}
			};

			sequence.getAminoAcid = function (position, reverseComplemented) {
				var aminoAcid = this.aminoAcidMap[reverseComplemented ? reverseComplement[this.get(position, position + 3)] : this.get(position, position + 3)];
				return (aminoAcid ? aminoAcid : "?");
			};

			sequence.getAminoAcidWithPrefix = function (position, prefix, reverseComplemented) {
				var aminoAcid = this.aminoAcidMap[reverseComplemented ? reverseComplement[prefix + this.get(position, position + 3 - prefix.length)] : prefix + this.get(position, position + 3 - prefix.length)];
				return (aminoAcid ? aminoAcid : "?");
			};
		}

		return sequence;
	}

	/**
	 * Find genes overlapping with a given region.
	 *
	 * @param {Object} context - The request context to be used.
	 * @param {String} referenceId - The reference genome ID.
	 * @param {Number} chromosomeIndex - The internal index of the chromosome as defined in the reference genome.
	 * @param {Number} begin - The begin position (inclusive, 0-based) in genomic coordinates within the given chromosome.
	 * @param {Number} end - The end position (exclusive, 0-based) in genomic coordinates within the given chromosome.
	 * @param {Bool} translate - Carry out translation of the coding DNA sequence into amino acids.
	 * 
	 * @returns {Array} List of gene definitions.
	 */
	async function findGenes(context, referenceId, chromosomeIndex, begin, end, translate) {
		var resultSet;
		var rowIndex;
		var region = null;
		var genes = [];

		// find genes overlapping region
		resultSet = await context.connection.executeQuery(
			"SELECT MIN( \"Region.Begin\" ) AS \"Min\", MAX( \"Region.End\" ) AS \"Max\" FROM \"hc.hph.genomics.db.models::Reference.Features\" WHERE \"ReferenceID\" = ? AND \"ChromosomeIndex\" = ? AND \"Region.End\" >= ? and \"Region.Begin\" < ? AND \"Class\" IN ( 'gene', 'mRNA', 'exon', 'CDS' )",
			referenceId,
			chromosomeIndex,
			begin,
			end
		);
		if (resultSet.length === 1) {
			region = { begin: resultSet[0].Min, end: resultSet[0].Max };
		}
		else if (resultSet.length === 0) {
			throw new BioInfError("error.NoResultsRangeCheck");
		}
		else {
			throw new BioInfError("error.TooManyRangeCheck");
		}

		if (region && (region.begin !== null) && (region.end !== null)) {
			var geneMap = {};
			var mRNAs = {};
			var featureClass;
			var gene = null;
			var mRNA;
			var parents;
			var parentIndex;
			var translations;
			var translationIndex;
			var segments;
			var segmentIndex;
			var proteinName;
			var translation;
			var segment;
			var lastSegment;

			// find genes in specified region
			resultSet = await context.connection.executeQuery(
				"SELECT \"Class\", \"FeatureID\", \"FeatureName\", \"Region.Begin\" AS \"Begin\", \"Region.End\" AS \"End\", \"Strand\", \"ParentID\", \"Frame\" FROM \"hc.hph.genomics.db.models::Reference.Features\" WHERE \"ReferenceID\" = ? AND \"ChromosomeIndex\" = ? AND \"Region.Begin\" >= ? AND \"Region.End\" <= ? AND \"Class\" IN ( 'gene', 'mRNA', 'exon', 'CDS' ) ORDER BY \"Region.Begin\" ASC, \"Region.End\" DESC, CASE WHEN \"Class\" = 'gene' THEN 0 WHEN \"Class\" = 'mRNA' THEN 1 WHEN \"Class\" = 'exon' THEN 2 ELSE 3 END, \"FeatureID\" ASC",
				referenceId,
				chromosomeIndex,
				region.begin,
				region.end
			);
			for (rowIndex in resultSet) {
				featureClass = resultSet[rowIndex].Class;
				if (featureClass === "gene") {
					if ((gene !== null) && (gene.name === resultSet[rowIndex].FeatureName) && (gene.strand === resultSet[rowIndex].Strand)) {
						gene.begin = Math.min(gene.begin, resultSet[rowIndex].Begin);
						gene.end = Math.max(gene.end, resultSet[rowIndex].End);
					}
					else {
						gene = {
							name: resultSet[rowIndex].FeatureName,
							begin: resultSet[rowIndex].Begin,
							end: resultSet[rowIndex].End,
							strand: resultSet[rowIndex].Strand,
							translations: []
						};
						genes.push(gene);
					}
					geneMap[resultSet[rowIndex].FeatureID] = gene;
				}
				else if (featureClass === "mRNA") {
					parents = resultSet[rowIndex].ParentID.split(",");
					for (parentIndex = 0; parentIndex < parents.length; ++parentIndex) {
						gene = geneMap[parents[parentIndex]];
						if (gene) {
							mRNA = {
								gene: gene,
								name: resultSet[rowIndex].FeatureName,
								segments: []
							};
							mRNAs[resultSet[rowIndex].FeatureID] = mRNA;
						}
					}
				}
				else if (featureClass === "exon") {
					parents = resultSet[rowIndex].ParentID.split(",");
					for (parentIndex = 0; parentIndex < parents.length; ++parentIndex) {
						mRNA = mRNAs[parents[parentIndex]];
						if (mRNA) {
							translations = mRNA.gene.translations;
							for (translationIndex = 0; translationIndex < translations.length; ++translationIndex) {
								if ((translations[translationIndex].name === mRNA.name) && (translations[translationIndex].protein === proteinName)) {
									translations[translationIndex].segments.push({
										begin: resultSet[rowIndex].Begin,
										end: resultSet[rowIndex].End
									});
								}
							}
							mRNA.segments.push({
								begin: resultSet[rowIndex].Begin,
								end: resultSet[rowIndex].End
							});
						}
					}
				}
				else if (featureClass === "CDS") {
					parents = resultSet[rowIndex].ParentID.split(",");
					for (parentIndex = 0; parentIndex < parents.length; ++parentIndex) {
						mRNA = mRNAs[parents[parentIndex]];
						if (mRNA) {
							proteinName = resultSet[rowIndex].FeatureName ? resultSet[rowIndex].FeatureName : resultSet[rowIndex].FeatureID;
							translations = mRNA.gene.translations;
							translation = null;
							for (translationIndex = 0; translationIndex < translations.length; ++translationIndex) {
								if ((translations[translationIndex].name === mRNA.name) && (translations[translationIndex].protein === proteinName)) {
									translation = translations[translationIndex];
									break;
								}
							}
							if (translation === null) {
								translation = {
									name: mRNA.name,
									protein: proteinName,
									segments: mRNA.segments.slice(0),
									cdsLength: 0
								};
								translations.push(translation);
							}
							if (translation.segments.length === 0) {
								translation.segments.push({
									begin: resultSet[rowIndex].Begin,
									end: resultSet[rowIndex].End,
									phase: resultSet[rowIndex].Frame
								});
							}
							else {
								lastSegment = translation.segments[translation.segments.length - 1];
								segment = {
									begin: resultSet[rowIndex].Begin,
									end: resultSet[rowIndex].End,
									phase: resultSet[rowIndex].Frame
								};
								if (lastSegment.end <= segment.begin) {
									translation.segments.push(segment);
								}
								else {
									translation.segments.pop();
									if (lastSegment.begin < segment.begin) {
										translation.segments.push({
											begin: lastSegment.begin,
											end: segment.begin
										});
									}
									translation.segments.push(segment);
									if (lastSegment.end > segment.end) {
										translation.segments.push({
											begin: segment.end,
											end: lastSegment.end
										});
									}
								}
							}
							translation.cdsLength += resultSet[rowIndex].End - resultSet[rowIndex].Begin;
						}
					}
				}
			}

			// get information for translation
			var sequence = await loadAminoAcidSequence(context, referenceId, chromosomeIndex, region.begin, region.end, translate);

			// post-process genes
			var sort = function (left, right) { return right.cdsLength - left.cdsLength; };
			for (var geneIndex = 0; geneIndex < genes.length; ++geneIndex) {
				gene = genes[geneIndex];
				gene.translations = gene.translations.sort(sort);
				translations = gene.translations;

				// mark first/last segment with strand flag
				if (translations.length > 0) {
					if (gene.strand === "+") {
						for (translationIndex = 0; translationIndex < translations.length; ++translationIndex) {
							translations[translationIndex].segments[translations[translationIndex].segments.length - 1].strand = "+";
						}
					}
					else if (gene.strand === "-") {
						for (translationIndex = 0; translationIndex < translations.length; ++translationIndex) {
							translations[translationIndex].segments[0].strand = "-";
						}
					}
				}

				// apply translation to sequences for CDS
				if (sequence.get && ((gene.strand === "+") || (gene.strand === "-"))) {
					var reverseComplemented = (gene.strand === "-");
					for (translationIndex = 0; translationIndex < translations.length; ++translationIndex) {
						segments = translations[translationIndex].segments;
						var remainingNucleotides = "";
						var lastCDS = null;
						for (segmentIndex = 0; segmentIndex < segments.length; ++segmentIndex) {
							segment = segments[segmentIndex];
							if (segment.phase !== undefined) {
								if (reverseComplemented) // correct phase to be the LHS shift of frame in case of reverse strand
								{
									segment.phase = (segment.end - segment.phase - segment.begin) % 3;
								}
								if (segment.phase > 0) {
									if (segment.phase === (3 - remainingNucleotides.length)) {
										segment.sequence = sequence.getAminoAcidWithPrefix(segment.begin, remainingNucleotides, reverseComplemented);
									}
									if (!segment.sequence) {
										segment.sequence = "?";
									}
									if (lastCDS) {
										lastCDS.sequence += segment.sequence;
									}
								}
								else {
									segment.sequence = "";
								}

								var segmentEnd = segment.begin + segment.phase + 3 * Math.floor((segment.end - segment.begin - segment.phase) / 3);
								for (var segmentCursor = segment.begin + segment.phase; segmentCursor < segmentEnd; segmentCursor += 3) {
									segment.sequence += sequence.getAminoAcid(segmentCursor, reverseComplemented);
								}
								remainingNucleotides = sequence.get(segmentCursor, segmentCursor + ((segment.end - segment.begin - segment.phase) % 3));
								lastCDS = segment;
							}
						}
					}
				}
			}
		}

		return genes;
	}

	// public API - everything in exports will be accessible from other libraries

	exports.loadReferenceSequence = loadReferenceSequence;
	exports.findGenes = findGenes;
	exports.resolveGeneSynonym = resolveGeneSynonym;

})(module.exports);
