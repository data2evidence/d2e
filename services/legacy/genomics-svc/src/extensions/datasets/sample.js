(function (exports) {

	"use strict";

	let error = require(__base + "error");

	async function setSamples(context, parameters) {
		if (parameters.groupId === "*") {
			await context.connection.executeUpdate(
				"INSERT INTO \"" + parameters.tableName + "\" ( \"SampleIndex\" ) SELECT \"SampleIndex\" FROM \"hc.hph.genomics.db.models::General.Samples\""
			);
		}
		else {
			await Promise.all(parameters.groupId.split(',').map(
				sample => {
					let sampleIndex = parseInt(sample.trim(), 10);
					if ((sampleIndex === undefined) || (sampleIndex === null) || isNaN(sampleIndex)) {
						throw new error.BioInfError("error.InvalidParameter", ["sample", sample]);
					}
					return context.connection.executeUpdate(
						"INSERT INTO \"" + parameters.tableName + "\" ( \"SampleIndex\" ) VALUES ( ? )",
						sampleIndex
					);
				}
			));
		}
	}

	// public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

	exports.setSamples = setSamples;

	exports.api = {
		setSamples: setSamples
	};

})(module.exports);
