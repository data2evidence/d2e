(function (exports) {

	"use strict";

	async function setSamples(context, parameters) {
		if (parameters.groupId === '*') {
			await context.connection.executeUpdate("INSERT INTO \"" + parameters.tableName + "\" SELECT DISTINCT \"SampleIndex\" FROM \"hc.hph.genomics.db.models::General.SessionSampleGroups\"");
		}
		else {
			await context.connection.executeUpdate(
				"INSERT INTO \"" + parameters.tableName + "\" SELECT \"SampleIndex\" FROM \"hc.hph.genomics.db.models::General.SessionSampleGroups\" WHERE \"SampleGroup\" = ?",
				parameters.groupId
			);
		}
	}

	// public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

	exports.setSamples = setSamples;

	exports.api = {
		setSamples: setSamples
	};

})(module.exports);
