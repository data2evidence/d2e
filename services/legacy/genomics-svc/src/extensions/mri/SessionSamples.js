(function (exports) {

    "use strict";
    let errorLib = require(__base + "error");
    let sampleGroups = require(__base + "extensions/SampleGroups");
    let apiEndPoint = "/hc/mri/pa/genomics/services/sessionSamples.js";

    async function validateSamples(context, parameters) {
        return context.sendRequest('mri-svc', {
            method: "POST",
            path: apiEndPoint,
            queryParameters: {call: "validateSamples"},
            body: parameters
        }, 10).then( responseContent => {
            var censoringThreshold = responseContent.censoringThreshold;
            return context.connection.executeQuery(
                "SELECT COUNT(DISTINCT(\"SampleIndex\")) as cnt FROM \"" + parameters.tableName + "\""
            ).then(
                result => {
                    if (result.length === 1) {
                        var sampleCount = result[0].cnt;
                        if (sampleCount < censoringThreshold) {
                            return context.createTemporarySampleTable();
                        }
                        // empty return means that the input table name will be used
                    }
                    else {
                        throw errorLib.BioInfError("error.Internal", [], "Received more results than expected");
                    }
                }
            );
        });
    }

    function createCohorts(context, parameters) {
        parameters.username = context.httpRequest.user.id;
        return context.sendRequest('mri-svc', {
            method: "POST",
            path: apiEndPoint,
            queryParameters: {call: "createCohorts"},
            body: parameters
        }, 10);
    }

    async function prepareCohorts(context, parameters) {
        var isLoaded = false;
        if (!isLoaded) {
            await copyCohortFromSession(context, parameters);
            isLoaded = true;
        }
        await _updateSessionValidity(context, parameters);
        return {};
    }

    async function _updateSessionValidity(context, parameters) {
        var query;

        query = "UPDATE \"hc.mri.pa.genomics.db.model::MRI.SessionHeaders\" " +
            "SET \"ValidUntil\" = ADD_SECONDS(CURRENT_UTCTIMESTAMP,7200) " +
            "WHERE \"Id\" = ?";
        await context.connection.executeUpdate(
            query,
            parameters.sessionId
        );
        await context.connection.commit();
    }

    async function copyCohortFromSession(context, parameters) {
        if (!parameters || !parameters.sessionId || !(typeof (parameters.sessionId) === "string")) {
            throw new errorLib.BioInfError("error.MissingRequestParameter", ["sessionId"]);
        }
        let sampleGroupsTableName = 'hc.hph.genomics.db.models::General.SessionSampleGroups';
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            sampleGroupsTableName = await context.createTemporarySampleGroupsTable();
        }
        var query = "INSERT INTO \"" + sampleGroupsTableName + "\" (\"SampleGroup\", \"SampleIndex\") " +
            "(SELECT \"SampleGroup\", \"SampleIndex\" " +
            "FROM \"hc.mri.pa.genomics.db.model::MRI.Sessions\" " +
            "WHERE \"SessionId\" = ?)";
        var sampleCount = await context.connection.executeUpdate(
            query,
            parameters.sessionId
        );
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            await sampleGroups.split(context, sampleGroupsTableName, parameters);
        }
        return sampleCount;
    }

    function cleanUp(context) {
        return context.sendRequest('mri-svc', {
            method: "POST",
            path: apiEndPoint,
            queryParameters: {call: "cleanUp"},
            body: parameters
        }, 10);
    }
    exports.api = {
        validateSamples: validateSamples,
        createCohorts: createCohorts,
        prepareCohorts: prepareCohorts,
        cleanUp: cleanUp
    };
})(module.exports);