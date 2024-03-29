(function (exports) {

    "use strict";

    let errorLib = require(__base + "error");
    let apiEndPoint = "/hc/mri/pa/genomics/services/sessionSamples.js";

    async function validateSamples(context, parameters) {
        let tempSampleList = parameters.tableName;
        parameters.samples = await context.connection.executeQuery('SELECT "SampleIndex" FROM ' + tempSampleList);
        delete parameters.tableName;
        let tempSampleListTable = await context.createTemporarySampleTable();
        if(Array.isArray(parameters.samples) && parameters.samples.length === 0){
            return tempSampleListTable;
        } else if(Array.isArray(parameters.samples) && (parameters.samples.length > 1) && (parameters.configData.applicationType !== "psvbAll")){
            throw new errorLib.BioInfSecurityError("Only one sample is allowed to be used");  
        }
        return context.sendRequest('mri-svc', {
            method: "POST",
            path: apiEndPoint,
            queryParameters: { call: "validatePSSamples" },
            body: parameters
        }, 10).then(responseContent => context.connection.executeQuery('SELECT "Samples"."SampleIndex" FROM "hc.hph.genomics.db.models::General.Samples" AS "Samples" INNER JOIN "' + tempSampleList + '" AS "TempSTable" ON "Samples"."SampleIndex"="TempSTable"."SampleIndex" WHERE "Samples"."PatientDWID"=HEXTOBIN(?)', responseContent[0]["patient.attributes.pid"]))
            .then(resultSet => context.connection.executeBulkUpdate('INSERT INTO "' + tempSampleListTable + '" VALUES (?)', resultSet.map(row => [row.SampleIndex])))
            .then(updateCount => tempSampleListTable);   
    }

    exports.api = {
        validateSamples: validateSamples
    };
})(module.exports);