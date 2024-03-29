(function (exports) {

	"use strict";

	let error = require(__base + "error");

	async function validateSamples(context, parameters) {
		if (parameters.throwFatal) {
			throw new error.BioInfSecurityError("Invalid sample ID");
		}
		if (parameters.throwNonFatal) {
			throw Error("Non-fatal error");
		}
		if (parameters.pruneOdd & (!parameters.pruneEven)) {
			let newTableName = await context.createTemporarySampleTable();
			await context.connection.executeUpdate("INSERT INTO \"" + newTableName + "\" SELECT \"SampleIndex\" from \"" + parameters.tableName + "\" WHERE MOD(\"SampleIndex\", 2) = 1");
			return newTableName;
		}
		else if (parameters.pruneEven && (!parameter.pruneOdd)) {
			let newTableName = await context.createTemporarySampleTable();
			await context.connection.executeUpdate("INSERT INTO \"" + newTableName + "\" SELECT \"SampleIndex\" from \"" + parameters.tableName + "\" WHERE MOD(\"SampleIndex\", 2) = 0");
			return newTableName;
		}
		else if (parameters.pruneAll || (parameters.pruneEven && parameters.pruneOdd)) {
			return await context.createTemporarySampleTable();
		}
	}

	// public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

	exports.api = {
		validateSamples: validateSamples
	};

})(module.exports);
