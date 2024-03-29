(function (exports) {

    "use strict";

    let error = require(__base + "error");
    let extensions = require(__base + "extensions");

    async function load(context, parameters) {
        if (parameters.groupsRequest) {
            var groups = await extensions.getFunction(parameters.groupsRequest)(context, parameters.groupsParameters);
            if (!Array.isArray(groups)) {
                return { message: "Unexpected return from '" + parameters.groupsRequest + "'" };
            }
            else if (parameters.maxCount && (groups.length > parameters.maxCount)) {
                return { message: 'error.TooManyResultsReceived' };
            }

            groups.sort(function (a, b) {
                return (a.name > b.name) - (a.name < b.name);
            });

            if (parameters.trackRequest) {
                var groupResult = [];
                var resultFunction = extensions.getFunction(parameters.trackRequest);

                for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
                    var sCategoryNumber = -1;
                    if (groups[groupIndex].categoryNumber) {
                        sCategoryNumber = groups[groupIndex].categoryNumber;
                    }
                    var group = { name: groups[groupIndex].name, categoryNumber: sCategoryNumber };
                    var executionStartTime = Date.now();
                    /* try
                      {*/
                    if ((typeof group.name != 'string') && (!group.name instanceof String)) {
                        throw new error.BioInfError("error.UnexpectedResult", ["group", group.name]);
                    }
                    var groupId = groups[groupIndex].id;
                    if ((typeof groupId !== 'string') && (!groupId instanceof String)) {
                        throw new error.BioInfError("error.UnexpectedResult", ["group id", groupId]);
                    }
                    if (groupId === '-' && parameters.annotationConfig && parameters.annotationConfig.sampleConfig) {
                        group.result = [];
                    } else {
                        var trackParameters = extensions.mergeParameters(parameters, parameters.trackParameters, { dataset: groupId });
                        delete trackParameters.groupsRequest;
                        delete trackParameters.groupsParameters;
                        delete trackParameters.trackRequest;
                        delete trackParameters.trackParameters;
                        delete trackParameters.maxCount;
                        group.result = await resultFunction(context, trackParameters);
                    }
                    /*}
                     catch ( exception )
                     {
                         delete group.result;
                         group.message = "Error: " + exception;
                     }*/
                    group.executionTime = Date.now() - executionStartTime;
                    groupResult.push(group);
                }

                if (parameters.mergeGroup === true) {
                    resultFunction = extensions.getFunction(parameters.mergeGroupPlugin);
                    groupResult = await resultFunction(context, parameters, groupResult);
                }

                return groupResult;
            }
            else {
                return groups;
            }
        }
        else {
            throw new error.BioInfError("error.MissingRequestParameter", ["Groups"]);
        }
    }

    async function getSessionSamples(context, parameters) {
        if (!parameters) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }
        else if (!parameters.dataset) {
            throw new error.BioInfError("error.InvalidParameter", ["dataset", parameters.dataset]);
        }
        var groups = [];
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            groups = await getSampleCategoryGroup(context, parameters, false);
        } else {
            var procedure = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.model::SampleNames");
            var resultSet = (await procedure(sampleListTableName)).SAMPLE_NAMES;
            for (var rowIndex in resultSet) {
                groups.push({ id: "sample:" + resultSet[rowIndex].SampleIndex, name: resultSet[rowIndex].SampleIndex, data: [] });
            }
        }
        return groups;
    }

    async function getSessionGroups(context, parameters) {
        var groups = [];
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            groups = await getSampleCategoryGroup(context, parameters, true);
        } else {
            var resultSet = await context.connection.executeQuery(
                "select distinct \"SampleGroup\" from \"hc.hph.genomics.db.models::General.SessionSampleGroups\""
            );
            for (var rowIndex in resultSet) {
                groups.push({ id: "session:" + resultSet[rowIndex].SampleGroup, name: resultSet[rowIndex].SampleGroup, data: [] });
            }
        }
        return groups;
    }

    async function getSampleCategoryGroup(context, parameters, isSessionSampleGroups) {
        var groups = [];
        if (isSessionSampleGroups && context.categoryGroups && Array.isArray(context.categoryGroups) && context.categoryGroups.length !== 0) {
            for (var rowIndex in context.categoryGroups) {
                groups.push({ id: "session:" + context.categoryGroups[rowIndex].name, name: context.categoryGroups[rowIndex].name, categoryNumber: context.categoryGroups[rowIndex].categoryNumber, data: [] });
            }
        } else if ((!isSessionSampleGroups) && context.categoryGroups && Array.isArray(context.categoryGroups) && context.categoryGroups.length !== 0) {
            var resultSet = await context.connection.executeQuery("select \"SampleGroup\", \"SampleIndex\" from \"hc.hph.genomics.db.models::General.SessionSampleGroups\"");
            var actualGroups = resultSet.reduce(function (acc, obj) {
                var key = obj.SampleGroup;
                if (!(acc[key])) {
                    acc[key] = { samples: [] };
                }
                acc[key].samples.push(obj.SampleIndex);
                return acc;
            }, {});
            for (var rowIndex in context.categoryGroups) {
                if (actualGroups.hasOwnProperty(context.categoryGroups[rowIndex].name)) {
                    groups.push({ id: "sample:" + actualGroups[context.categoryGroups[rowIndex].name].samples.join(), name: context.categoryGroups[rowIndex].name, categoryNumber: context.categoryGroups[rowIndex].categoryNumber, data: [] });
                } else {
                    groups.push({ id: "-", name: context.categoryGroups[rowIndex].name, categoryNumber: context.categoryGroups[rowIndex].categoryNumber, data: [] });
                }
            }
        }
        return groups;
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getSessionGroups = getSessionGroups;
    exports.getSessionSamples = getSessionSamples;
    exports.load = load;

    exports.api = {
        getSessionGroups: getSessionGroups,
        getSessionSamples: getSessionSamples,
        load: load
    };

})(module.exports);