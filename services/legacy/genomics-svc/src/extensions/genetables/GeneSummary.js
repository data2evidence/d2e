(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let uuid = require('uuid/v1');
    let oGeneral = require(__base + "extensions/vb/General");

    function identifyColumnNameForSort(inputColumn) {
        var outputColumnName;
        switch (inputColumn) {
            case "geneName":
            case "gene":
                outputColumnName = "Gene name";
                break;
            case "patientFraction":
                outputColumnName = "Patient fraction";
                break;
            case null:
                outputColumnName = "Patient fraction";
                break;
            default:
                if (inputColumn.indexOf("patientPercentage") !== -1) {
                    outputColumnName = "Patient fraction";
                } else if (inputColumn.indexOf("patientCount") !== -1) {
                    outputColumnName = "Patient count";
                } else if (inputColumn.indexOf("variantCount") !== -1) {
                    outputColumnName = "Variant count";
                }
        }

        return outputColumnName;
    }

    async function getGeneSummaryData(context, parameters) {
        var dbContent, resultSet;
        if (!parameters.reference) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }
        parameters.sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        if (!parameters.sort) {
            parameters.sort = { column: null, sortType: null };
        }
        var annotationGrouping = await oGeneral.getAnnotationGrouping(context, parameters);
        var actualColumnName = identifyColumnNameForSort(parameters.sort.column);
        dbContent = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.genetables::GeneSummary");
        if (annotationGrouping) {
            resultSet = await dbContent(parameters.sampleListTableName, annotationGrouping.intermediateResults, 1, actualColumnName, parameters.sort.sortType, parameters.reference);
        } else {
            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                var genomicFilterResult = await oGeneral.getGenomicFilterData(context, parameters);
                resultSet = await dbContent(parameters.sampleListTableName, genomicFilterResult.intermediateResults, 1, actualColumnName, parameters.sort.sortType, parameters.reference);
            } else {
                var emptyIntermediateResult = await context.connection.executeQuery('SELECT "DWAuditID",  "VariantIndex", NULL as "AlleleIndex", NULL AS "Grouping" FROM "hc.hph.genomics.db.models::SNV.Genotypes" WHERE 0 = 1');
                resultSet = await dbContent(parameters.sampleListTableName, emptyIntermediateResult, 0, actualColumnName, parameters.sort.sortType, parameters.reference);
            }
        }
        var outputJson = [];
        for (var index in resultSet.OUTPUT_TABLE) {
            var object = {
                gene: resultSet.OUTPUT_TABLE[index]["Gene name"],
                patientPercentage: resultSet.OUTPUT_TABLE[index]["Patient fraction"],
                patientCount: resultSet.OUTPUT_TABLE[index]["Patient count"],
                //	variantFrequency: resultSet.OUTPUT_TABLE[index]["Variant frequency"],
                variantCount: resultSet.OUTPUT_TABLE[index]["Variant count"],
                //	genotypeFrequency: resultSet.OUTPUT_TABLE[index]["Genotype frequency"],
                //	genotypeCount: resultSet.OUTPUT_TABLE[index]["Genotype count"],
                //	pValue:Math.exp(resultSet.OUTPUT_TABLE[index].pValue)
                totalPatients: resultSet.OUTPUT_TABLE[index]["Total patients"]
            };
            outputJson.push(object);
        }

        return outputJson;
    }

    async function returnFinalResult(context, groupsParameters, groupResult) {
        var outputJson = [];
        var aCohorts = [];
        var temparrayObj = groupResult;
        groupResult = [];
        for (var group = 0; group < temparrayObj.length; group++) {
            if (temparrayObj[group].result && Array.isArray(temparrayObj[group].result) && temparrayObj[group].result.length !== 0) {
                groupResult.push(temparrayObj[group]);
            }
        }
        temparrayObj = [];
        var groupCount = groupResult.length;
        var sPathName;
        for (var grpIndex = 0; grpIndex < groupResult.length; grpIndex++) {
            sPathName = groupResult[grpIndex].name.replace(/ /g, "_");
            groupResult[grpIndex].pathName = sPathName;
            aCohorts.push({ "path": sPathName, "name": groupResult[grpIndex].name });
        }

        for (var grpIndex = 0; grpIndex < groupResult.length; grpIndex++) {
            var geneGroup = groupResult[grpIndex].result;
            for (var geneIdx = 0; geneIdx < geneGroup.length; geneIdx++) {
                var geneName = geneGroup[geneIdx].gene;
                var isGene = false;
                for (var outIdx = 0; outIdx < outputJson.length; outIdx++) {
                    if (geneName === outputJson[outIdx].gene) {
                        isGene = true;
                        for (var cohortId in outputJson[outIdx].cohorts) {
                            if (outputJson[outIdx].cohorts.hasOwnProperty(cohortId) && groupResult[grpIndex].pathName === cohortId) {
                                outputJson[outIdx].cohorts[cohortId].name = groupResult[grpIndex].name;
                                outputJson[outIdx].cohorts[cohortId].patientCount = geneGroup[geneIdx].patientCount;
                                outputJson[outIdx].cohorts[cohortId].patientPercentage = geneGroup[geneIdx].patientPercentage;
                                outputJson[outIdx].cohorts[cohortId].variantCount = geneGroup[geneIdx].variantCount;
                                outputJson[outIdx].cohorts[cohortId].totalpatientCount = geneGroup[geneIdx].totalPatients;
                                break;
                            }
                        }
                        break;
                    }
                }
                if (isGene === false) {
                    var geneObject = {
                        gene: geneGroup[geneIdx].gene,
                        cohorts: {}
                    };
                    for (var grp = 0; grp < groupResult.length; grp++) {
                        var grpPathName = groupResult[grp].pathName;
                        geneObject.cohorts[grpPathName] = {
                            name: groupResult[grp].name,
                            patientCount: 0,
                            patientPercentage: 0,
                            variantCount: 0,
                            totalpatientCount: 0
                        };
                        if (groupResult[grpIndex].name === groupResult[grp].name) {
                            geneObject.cohorts[grpPathName].name = groupResult[grp].name;
                            geneObject.cohorts[grpPathName].patientCount = geneGroup[geneIdx].patientCount;
                            geneObject.cohorts[grpPathName].patientPercentage = geneGroup[geneIdx].patientPercentage;
                            geneObject.cohorts[grpPathName].variantCount = geneGroup[geneIdx].variantCount;
                            geneObject.cohorts[grpPathName].totalpatientCount = geneGroup[geneIdx].totalPatients;
                        }
                    }
                    outputJson.push(geneObject);
                }
            }
        }
        if (groupResult.length === 2) { //specific for PValue calculations
            var pValueInputObject = [];
            var cohort1name = groupResult[0].pathName;
            var cohort2name = groupResult[1].pathName;
            for (var geneIndex = 0; geneIndex < outputJson.length; geneIndex++) {
                var inputRow = {
                    GeneName: outputJson[geneIndex].gene,
                    Cohort1Affected: 0,
                    Cohort2Affected: 0,
                    Cohort1Total: 0,
                    Cohort2Total: 0
                };
                for (var cohort in outputJson[geneIndex].cohorts) {
                    if (outputJson[geneIndex].cohorts.hasOwnProperty(cohort) && cohort1name === cohort) {
                        inputRow.Cohort1Affected = outputJson[geneIndex].cohorts[cohort].patientCount;
                        inputRow.Cohort1Total = outputJson[geneIndex].cohorts[cohort].totalpatientCount;
                    } else if (outputJson[geneIndex].cohorts.hasOwnProperty(cohort) && cohort2name === cohort) {
                        inputRow.Cohort2Affected = outputJson[geneIndex].cohorts[cohort].patientCount;
                        inputRow.Cohort2Total = outputJson[geneIndex].cohorts[cohort].totalpatientCount;
                    }
                }
                pValueInputObject.push(inputRow);
            }
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.genetables::GeneCohortPValue");
            var result = await procedure(pValueInputObject);
            for (geneIndex = 0; geneIndex < result.PVALUE.length; geneIndex++) {
                var geneName = result.PVALUE[geneIndex].GeneName;
                for (var geneIdx = 0; geneIdx < outputJson.length; geneIdx++) {
                    if (geneName === outputJson[geneIdx].gene) {
                        outputJson[geneIdx].pValue = Math.exp(result.PVALUE[geneIndex].PValue);
                        break;
                    }
                }
            }
        }
        if (outputJson.length !== 0) {
            outputJson = addMetadata(outputJson, aCohorts, groupCount);
            return outputJson;
        } else {
            throw new error.BioInfError("error.NoData", ["No data available"]);
        }

    }

    function addMetadata(outputJson, aCohorts, groupCount) {

        var metaObj = {
            "dataLabel": "patientVariants"
        };

        //var visibleColumns = [
        metaObj.visibleColumns = [
            {
                "key": "gene",
                "display_name": "common.Genes",
                "formatter": "",
                "title": "geneSummary.geneTooltip",
                "control": "m.Link",
                "press": "handleGeneLinkPress",
                "prop": {
                    "sortProperty": "gene"
                }
            }];

        //outputJson.	
        if (aCohorts.length >= 1 && aCohorts.length < 3) {
            for (var i = 0; i < aCohorts.length; i++) {
                var sCPath = "cohorts/" + aCohorts[i].path + "/";
                var sPrefixPath = (aCohorts[i].path === "Current_Patient_Group") ? "" : aCohorts[i].name;

                metaObj.visibleColumns.push({
                    "key": sCPath + "patientPercentage",
                    "display_name": "geneSummary.patientFraction",
                    "formatter": "",
                    "title": "geneSummary.patientFractionTooltip",
                    "control": "m.Label",
                    "prefixData": sPrefixPath,
                    "label": {
                        "type": "multilabel"
                    },
                    "prop": {
                        "sortProperty": "patientPercentage"
                    }
                });
                metaObj.visibleColumns.push({
                    "key": sCPath + "patientCount",
                    "display_name": "geneSummary.patientCount",
                    "formatter": "",
                    "prefixData": sPrefixPath,
                    "label": {
                        "type": "multilabel"
                    },
                    "title": "geneSummary.patientCountTooltip",
                    "control": "m.Label",
                    "prop": {
                        "sortProperty": "patientCount"
                    }
                });
                metaObj.visibleColumns.push({
                    "key": sCPath + "variantCount",
                    "display_name": "geneSummary.variantCount",
                    "formatter": "",
                    "prefixData": sPrefixPath,
                    "label": {
                        "type": "multilabel"
                    },
                    "title": "geneSummary.variantsCountTooltip",
                    "control": "m.Label",
                    "prop": {
                        "sortProperty": "variantCount"
                    }
                });

            }
            if (aCohorts.length === 2) {
                metaObj.visibleColumns.push({
                    "key": "pValue",
                    "display_name": "geneSummary.pValue",
                    "title": "geneSummary.pValueTooltip",
                    "control": "m.Label"
                });
            }

        } else {
            sCPath = "";

            metaObj.visibleColumns.push({
                "key": sCPath + "patientPercentage",
                "display_name": "geneSummary.patientFraction",
                "formatter": "",
                "title": "geneSummary.patientFractionTooltip",
                "control": "m.Label"

            });
            metaObj.visibleColumns.push({
                "key": sCPath + "patientCount",
                "display_name": "geneSummary.patientCount",
                "formatter": "",
                "title": "geneSummary.patientCountTooltip",
                "control": "m.Label"
            });
            metaObj.visibleColumns.push({
                "key": sCPath + "variantsCount",
                "display_name": "geneSummary.variantCount",
                "formatter": "",
                "title": "geneSummary.variantsCountTooltip",
                "control": "m.Label"
            });

        }
        return {
            "metadata": metaObj,
            "patientVariants": outputJson,
            "totalGroups": groupCount

        };

    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint
    exports.identifyColumnNameForSort = identifyColumnNameForSort;
    exports.api = {
        getGeneSummaryData: getGeneSummaryData,
        returnFinalResult: returnFinalResult
    };

})(module.exports);