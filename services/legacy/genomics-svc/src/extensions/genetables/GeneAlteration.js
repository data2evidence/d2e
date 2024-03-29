(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let uuid = require('uuid/v1');
    let oGeneral = require(__base + "extensions/vb/General");
    let oGeneSummary = require(__base + "extensions/genetables/GeneSummary");
    let auditLib = require(__base + "auditLog");

    async function returnFinalResult(context, groupsParameters, groupResult) {
        var outputJson = {
            "cohorts": [],
            "genes": [],
            "guardedPatientCount": 0
        };
        var temparrayObj = groupResult;
        groupResult = [];
        for (var group = 0; group < temparrayObj.length; group++) {
            if (temparrayObj[group].result && temparrayObj[group].result.cohorts && temparrayObj[group].result.cohorts.samples && Array.isArray(temparrayObj[group].result.cohorts.samples) && temparrayObj[group].result.cohorts.samples.length !== 0) {
                groupResult.push(temparrayObj[group]);
            }
        }
        temparrayObj = [];
        for (var grpIndex = 0; grpIndex < groupResult.length; grpIndex++) {
            var cohort = groupResult[grpIndex].result.cohorts;
            cohort.name = groupResult[grpIndex].name;
            outputJson.cohorts.push(cohort);
        }
        for (var grpIndex = 0; grpIndex < groupResult.length; grpIndex++) {
            var genes = groupResult[grpIndex].result.genes;
            if (outputJson.genes.length === 0) {
                outputJson.genes = genes;
                for (var outputGene = 0; outputGene < outputJson.genes.length; outputGene++) {
                    var variants = outputJson.genes[outputGene].variants;
                    outputJson.genes[outputGene].variants = [];
                    for (var cohortNum = 0; cohortNum < outputJson.cohorts.length; cohortNum++) {
                        outputJson.genes[outputGene].variants[cohortNum] = [];
                    }
                    for (var cohortNo = 0; cohortNo < outputJson.cohorts.length; cohortNo++) {
                        if (cohortNo === grpIndex) {
                            outputJson.genes[outputGene].variants[grpIndex] = variants;
                        } else {
                            var sample = outputJson.cohorts[cohortNo].samples;
                            for (var index = 0; index < sample.length; index++) {
                                outputJson.genes[outputGene].variants[cohortNo][index] = {};
                            }
                        }
                    }
                }
            } else {
                for (var geneIndex = 0; geneIndex < genes.length; geneIndex++) {
                    var geneflag = false;
                    for (var outputGene = 0; outputGene < outputJson.genes.length; outputGene++) {
                        if (genes[geneIndex].geneName === outputJson.genes[outputGene].geneName) {
                            geneflag = true;
                            outputJson.genes[outputGene].patientFraction += genes[geneIndex].patientFraction;
                            outputJson.genes[outputGene].variants[grpIndex] = genes[geneIndex].variants;
                            break;
                        }
                    }
                    if (geneflag === false) {
                        var geneMainObject = {
                            "geneName": genes[geneIndex].geneName,
                            "patientFraction": genes[geneIndex].patientFraction,
                            "variants": []
                        };
                        for (var cohortNum = 0; cohortNum < outputJson.cohorts.length; cohortNum++) {
                            geneMainObject.variants[cohortNum] = [];
                        }
                        for (var cohortNo = 0; cohortNo < outputJson.cohorts.length; cohortNo++) {
                            if (cohortNo === grpIndex) {
                                geneMainObject.variants[grpIndex] = genes[geneIndex].variants;
                            } else {
                                var sample = outputJson.cohorts[cohortNo].samples;
                                for (var index = 0; index < sample.length; index++) {
                                    geneMainObject.variants[cohortNo][index] = {};
                                }
                            }
                        }
                        outputJson.genes.push(geneMainObject);
                    }
                }
            }
        }
        var guardedPatientQuery = 'SELECT COUNT(DISTINCT S."PatientDWID") AS "GPatientCount" FROM "hc.hph.genomics.db.models::General.SessionSampleGroups" TT INNER JOIN "hc.hph.genomics.db.models::General.Samples" AS S ON TT."SampleIndex" = S."SampleIndex" INNER JOIN ' + (await context.getGlobalConfig("guardedTableMapping", "@PATIENT")) + ' AS gp ON S."PatientDWID" = gp."PatientID"';
        var guardedPatientCount = await context.connection.executeQuery(guardedPatientQuery);
        var count = parseInt(guardedPatientCount[0].GPatientCount, 10);
        outputJson.guardedPatientCount = count;
        if (outputJson.cohorts.length !== 0 && outputJson.genes.length !== 0) {
            outputJson = addMetaData(sortSamples(outputJson));
            return outputJson;
        } else {
            throw new error.BioInfError("error.NoData", ["No data available"]);
        }
    }
    function getCategoryConfigData(parameters, resultSet, geneMainObject, index, samIndex) {
        for (var iVariant = 0; iVariant < parameters.annotationConfig.groupConfig.categories.length; iVariant++) {
            if (resultSet.OUTPUT[index].Grouping === iVariant) {
                if (geneMainObject.variants[samIndex].SNV) {
                    if (resultSet.OUTPUT[index].Grouping < geneMainObject.variants[samIndex].SNV) {
                        geneMainObject.variants[samIndex].SNV = resultSet.OUTPUT[index].Grouping;
                        break;
                    }
                } else {
                    geneMainObject.variants[samIndex].SNV = resultSet.OUTPUT[index].Grouping;
                    break;
                }
            }
        }
    }

    function getVariantDataPerGene(parameters, resultSet, geneMainObject, index, sampleIndexSet) {
        if (sampleIndexSet.hasOwnProperty(resultSet.OUTPUT[index].index)) {
            if (parameters.annotationConfig && parameters.annotationConfig.groupConfig && parameters.annotationConfig.groupConfig.categories.length !== 0) {
                getCategoryConfigData(parameters, resultSet, geneMainObject, index, sampleIndexSet[resultSet.OUTPUT[index].index]);
            } else {
                geneMainObject.variants[sampleIndexSet[resultSet.OUTPUT[index].index]].SNV = resultSet.OUTPUT[index].Grouping;
            }
        }
    }

    async function getAlterationMatrixData(context, parameters) {
        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }
        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var annotationGrouping = await oGeneral.getAnnotationGrouping(context, parameters);
        var dbContent = {}, resultSet = {};
        if (!parameters.sort) {
            parameters.sort = { column: null, sortType: null };
        }
        var actualColumnName = oGeneSummary.identifyColumnNameForSort(parameters.sort.column);
        dbContent = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.genetables::GeneAlteration");
        if (annotationGrouping) {
            resultSet = await dbContent(parameters.sampleListTableName, annotationGrouping.intermediateResults, 1, actualColumnName, parameters.sort.sortType, parameters.reference, await context.getGlobalConfig("guardedTableMapping", "@PATIENT"));
        } else {
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await oGeneral.getGenomicFilterData(context, parameters);
                resultSet = await dbContent(parameters.sampleListTableName, genomicFilterResult.intermediateResults, 1, actualColumnName, parameters.sort.sortType, parameters.reference, await context.getGlobalConfig("guardedTableMapping", "@PATIENT"));
            } else {
                var emptyIntermediateResult = await context.connection.executeQuery('SELECT  "DWAuditID",  "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
                resultSet = await dbContent(parameters.sampleListTableName, emptyIntermediateResult, 0, actualColumnName, parameters.sort.sortType, parameters.reference, await context.getGlobalConfig("guardedTableMapping", "@PATIENT"));
            }
        }
        var outputJson = {
            "cohorts": {
                "name": parameters.dataset,
                "samples": []
            },
            "genes": []
        };
        if(resultSet.COHORTGROUP.length){
        const tempTable = await context.createTemporarySampleTable();
        await context.connection.executeBulkUpdate('INSERT INTO "' + tempTable + '" ("SampleIndex") VALUES (?)', resultSet.COHORTGROUP.map(row => [row.index]));
         // Log accessed attributes
         await auditLib.logAttributes( context, tempTable, "GeneAlteration", "Patient", [
            {name: "hc.hph.genomics.db.models::General.Samples.SampleID",successful:true},
            {name: "hc.hph.genomics.db.models::General.Samples.PatientDWID", successful:true},
            {name: "hc.hph.genomics.db.models::General.Samples.SampleClass", successful:true},
            {name: "hc.hph.genomics.db.models::General.Samples.InteractionDWID", successful:true},
            {name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.GivenName",successful:true},
            {name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.FamilyName",successful:true},
            {name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.BirthDate",successful:true},
        ], true, parameters.annotationConfig ? parameters.annotationConfig.groupConfig : undefined);
        }
        //cohort entry new version
        for (var idx in resultSet.COHORTGROUP) {

            var sample = {
                "index": resultSet.COHORTGROUP[idx].index,
                "interaction": {
                    "dwid": resultSet.COHORTGROUP[idx].interactionDWID,
                    "class": resultSet.COHORTGROUP[idx].class
                },
                "patient": {
                    "dwid": resultSet.COHORTGROUP[idx].patientDWID,
                    "id": resultSet.COHORTGROUP[idx].sampleID,
                    "firstName": resultSet.COHORTGROUP[idx].firstName,
                    "lastName": resultSet.COHORTGROUP[idx].lastName,
                    "birthDate": resultSet.COHORTGROUP[idx].birthDate
                }
            };
            outputJson.cohorts.samples.push(sample);
        }
        var tempGenes = {};
        var sampleIndexSet = {};
        for (var i in outputJson.cohorts.samples) {
            sampleIndexSet[outputJson.cohorts.samples[i].index] = i;
        }
        var geneMainObject = {};
        //Genes and variants entry new version
        for (var index in resultSet.OUTPUT) {
            var geneName = resultSet.OUTPUT[index]["Gene name"];
            var geneValue = null;
            if (tempGenes.hasOwnProperty(geneName)) {
                geneValue = tempGenes[geneName];
            }
            if (geneValue === null) {
                //New gene
                geneMainObject = {
                    "geneName": resultSet.OUTPUT[index]["Gene name"],
                    "patientFraction": resultSet.OUTPUT[index]["Patient fraction"],
                    "variants": []
                };
                var sample = outputJson.cohorts.samples;
                for (var i = 0; i < sample.length; i++) {
                    geneMainObject.variants[i] = {};
                }
                getVariantDataPerGene(parameters, resultSet, geneMainObject, index, sampleIndexSet);
                tempGenes[geneName] = geneMainObject;
            } else {
                //Existing gene
                getVariantDataPerGene(parameters, resultSet, geneMainObject, index, sampleIndexSet);
            }
        }

        // Convert tempGenes to gene array
        var key;
        for (key in tempGenes) {
            if (tempGenes.hasOwnProperty(key)) {
                outputJson.genes.push(tempGenes[key]);
            }
        }
        return outputJson;
    }

    function sortSamples(data) {
        // sort samples per cohort and remember permutation vector
        data.cohorts.forEach(
            function (cohort, cohortIndex) {
                // sort indices based on variant information
                var indices = Array.apply(null, { length: cohort.samples.length }).map(Number.call, Number).sort(
                    function (leftIndex, rightIndex) {
                        // sort by variant categories
                        var variants;
                        for (var geneIndex = 0; geneIndex < data.genes.length; ++geneIndex) {
                            variants = data.genes[geneIndex].variants[cohortIndex];
                            if (variants[leftIndex].SNV !== variants[rightIndex].SNV) {
                                if (variants[rightIndex].SNV === undefined) {
                                    return -1;
                                }
                                else if (variants[leftIndex].SNV === undefined) {
                                    return +1;
                                }
                                else {
                                    return variants[leftIndex].SNV - variants[rightIndex].SNV;
                                }
                            }
                        }

                        // fallback: sort by sample index to ensure stable sorting
                        return cohort.samples[leftIndex].index - cohort.samples[rightIndex].index;
                    }
                );

                // re-order samples based on indices
                cohort.samples = indices.map(function (index) { return cohort.samples[index]; });
                data.genes.forEach(
                    function (gene) {
                        gene.variants[cohortIndex] = indices.map(function (index) { return gene.variants[cohortIndex][index]; });
                    }
                );
            }
        );

        return data;
    }

    function addMetaData(outputJson) {

        return {
            "metadata": {
                "dataLabel": "genes",
                "visibleColumns": [{
                    "key": "geneName",
                    "display_name": "common.Genes",
                    "formatter": "",
                    "control": "m.Link",
                    "press": "handleGeneLinkPress",
                    "title": "geneSummary.geneTooltip",
                    "prop": {
                        "sortProperty": "geneName",
                        "width": "150px"
                    }
                }, {
                    "key": "patientFraction",
                    "display_name": "geneSummary.patientFraction",
                    "formatter": "",
                    "control": "m.Label",
                    "title": "geneSummary.patientFractionTooltip",
                    "prop": {
                        "sortProperty": "patientFraction",
                        "width": "150px"
                    }
                },
                {
                    "key": "variants",
                    "display_name": "geneSummary.geneAlterationVisualization",
                    "formatter": "",
                    "control": "custom",
                    "label": {
                        "type": "altMatrix"
                    },
                    "controlName": "returnAlterationMatrixTemplate",
                    "prop": {}
                }
                ]


            },
            genes: outputJson.genes,
            cohorts: outputJson.cohorts,
            guardedPatients: outputJson.guardedPatientCount
        };

    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.api = {
        getAlterationMatrixData: getAlterationMatrixData,
        returnFinalResult: returnFinalResult
    };
})(module.exports);