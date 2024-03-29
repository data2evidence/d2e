(function (exports) {

	"use strict";

	let error = require(__base + "error");

	async function fullReload(context, parameters) {
		if (parameters.reference === undefined) {
			throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
		}
		var chromosomeIndex = parseInt(parameters.chrom, 10);

		if (isNaN(chromosomeIndex) || (chromosomeIndex < 0)) {
			throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
		}
		var begin = parseInt(parameters.begin, 10);

		if (isNaN(begin) || (begin < 0)) {
			throw new error.BioInfError("error.MissingRequestParameter", ["begin"]);
		}
		var end = parseInt(parameters.end, 10);
		if (isNaN(end) || (end < 0)) {
			throw new error.BioInfError("error.MissingRequestParameter", ["end"]);
		}
		if (!context.connection) {
			throw new error.BioInfError("error.NoDBConnection");
		}

		var result = { sequence: null, size: null };
		if ((end - begin) < 1024) {
			var resultSet = await context.connection.executeQuery(
				'select "Region.Begin" as "Begin", "Sequence" from "hc.hph.genomics.db.models::Reference.Sequences" where "ReferenceID" = ? and "ChromosomeIndex" = ? and "Region.End" >= ? and "Region.Begin" < ? order by "Region.Begin"',
				parameters.reference,
				chromosomeIndex,
				begin,
				end
			);
			result = { sequence: '', begin: begin, size: 0 };
			for (var rowIndex in resultSet) {
				var sequence = resultSet[rowIndex].Sequence;
				var sequenceBegin = resultSet[rowIndex].Begin;
				var sequenceEnd = sequenceBegin + sequence.length;

				// cut off beginning and end if necessary
				if (sequenceBegin < begin) {
					sequence = sequence.slice(begin - sequenceBegin);
					sequenceBegin = begin;
				}
				if (sequenceEnd > end) {
					sequence = sequence.slice(0, end - sequenceBegin);
					sequenceEnd = end;
				}

				// only extend sequence if not too long
				if ((end - begin) < 102400) {
					// fill gaps with Ns
					result.size += (sequenceBegin - begin);
					for (; begin < sequenceBegin; ++begin) {
						result.sequence += 'N';
					}

					// add sequence at correct position
					result.sequence += sequence;

					result.size += sequence.length;
					begin += sequence.length;
				}
			}
		}

		return result;
	}

	async function init(context, parameters) {
		return {};
	}

	// public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

	exports.fullReload = fullReload;

	exports.api = {
		fullReload: fullReload
	};

})(module.exports);
