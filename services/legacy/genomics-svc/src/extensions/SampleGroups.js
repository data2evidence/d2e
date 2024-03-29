(function (exports) {

    "use strict";

    let error = require(__base + "error");

    async function initGroupsFromDataset(context, parameters) {
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }
        const sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        let sampleGroupsTableName = 'hc.hph.genomics.db.models::General.SessionSampleGroups';
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            sampleGroupsTableName = await context.createTemporarySampleGroupsTable();
        }
        const sampleCount = await context.connection.executeUpdate(`INSERT INTO "${sampleGroupsTableName}" ("SampleGroup", "SampleIndex")` +
         'SELECT '+
         'CASE WHEN p."GivenName" IS NOT NULL AND p."FamilyName" IS NOT NULL THEN p."FamilyName" || \' \' || p."GivenName" '+
            'WHEN p."GivenName" IS NOT NULL THEN p."GivenName" '+
            'WHEN p."FamilyName" IS NOT NULL THEN p."FamilyName" '+
            'ELSE s."PatientDWID" END AS "SampleGroup", sl."SampleIndex" ' +
        `FROM "${sampleListTableName}" AS sl` +
        ' LEFT OUTER JOIN "hc.hph.genomics.db.models::General.Samples" AS s ON sl."SampleIndex" = s."SampleIndex" ' +
        'LEFT OUTER JOIN "hc.hph.cdw.db.models::DWEntities.Patient_Attr" AS p ON s."PatientDWID" = p."DWID"');
        if (parameters.split || (parameters.annotationConfig && parameters.annotationConfig.sampleConfig)) {
            await split(context, sampleGroupsTableName, parameters);
        }
        return sampleCount;
    }
    
    async function split(context, sampleGroupsTableName, parameters) {
        let categories = parameters.split ? parameters.split.split(',') : parameters.annotationConfig.sampleConfig.sampleCategory;
        let sampleMap = await getSampleMap(context, categories, sampleGroupsTableName);
        let groups = createGroup(sampleMap, categories);
        let mergedGroups = mergeGroups(groups, parameters.annotationConfig.sampleConfig.categories);
        if (parameters.splitOnAnalysisDate) {
            mergedGroups = await createGroupOnDate(context, mergedGroups, sampleGroupsTableName);
        }
        let argsArray = [];
        context.categoryGroups = [];
        for (let groupIndex in mergedGroups) {
            for (let sample of mergedGroups[groupIndex].samples) {
                argsArray.push([mergedGroups[groupIndex].name, sample]);
            }
            context.categoryGroups.push( { name: mergedGroups[ groupIndex ].name, categoryNumber: mergedGroups[ groupIndex].categoryNumber} );
        }
        if (argsArray.length > 0 ) {
            await context.connection.executeBulkUpdate('INSERT INTO \"hc.hph.genomics.db.models::General.SessionSampleGroups\" VALUES ( ?, ? )', argsArray);
        }
    }

    async function getCategoryValue(context, aSplitList) {
        var sampleMap = {};
        var sQuery;
        var sGroup = null;
        sampleMap[sGroup] = [];
        for (var index = 0; index < aSplitList.length; index++) {
            var sAttr = aSplitList[index].trim();
            var iRow;
            var sCategory = sAttr;
            if (sAttr === 'ReferenceID') {
                sCategory = "ReferenceGenome";
            }
            sQuery = 'SELECT DISTINCT "Value.OriginalValue" AS "Value" FROM "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" WHERE "Attribute.OriginalValue" = ?';
            var resultSet = await context.connection.executeQuery(sQuery, sCategory);
            for (var sGroup in sampleMap) {
                for (iRow in resultSet) {
                    var result = resultSet[iRow];
                    var value = result.Value;
                    if (value === null) {
                        continue;
                    }
                    if (!sampleMap[sGroup][sAttr]) {
                        sampleMap[sGroup][sAttr] = {};
                    }
                    if (!sampleMap[sGroup][sAttr][value]) {
                        sampleMap[sGroup][sAttr][value] = [];
                    }
                }
            }
        }
        var oCategory = createGroup(sampleMap, aSplitList);
        var aCategoryValues = [];
        var iGroup, oGroup;
        var aSampleGroup = oCategory.group;
        for (iGroup = 0; iGroup < aSampleGroup.length; iGroup++) {
            for (oGroup in aSampleGroup[iGroup]) {
                aCategoryValues.push({ value: oGroup });
            }
        }
        return aCategoryValues;
    }

    async function getSampleMap(context, aSplitList, sampleGroupsTableName) {
        var sGroup, sampleMap = {};
        for (var index = 0; index < aSplitList.length; index++) {
            var sAttr = aSplitList[index].trim();
            let resultSet;
            if (sAttr === 'SampleClass' || sAttr === 'ReferenceID') {
                resultSet = await context.connection.executeQuery(
                    'SELECT sg."SampleGroup" as "Group", sg."SampleIndex" AS "Sample", sp."' + sAttr + '" AS "Value" FROM "' + sampleGroupsTableName + '" as sg ' +
                    ' LEFT OUTER JOIN "hc.hph.genomics.db.models::General.Samples" as sp ON sg."SampleIndex" = sp."SampleIndex"'
                );
            } else {
                resultSet = resultSet = await context.connection.executeQuery(
                    'SELECT sg."SampleGroup" as "Group", sg."SampleIndex" AS "Sample", idt."Value.OriginalValue" AS "Value" FROM "' + sampleGroupsTableName + '" as sg ' +
                    ' LEFT OUTER JOIN "hc.hph.genomics.db.models::General.Samples" as sp ON sg."SampleIndex" = sp."SampleIndex" ' +
                    ' LEFT OUTER JOIN "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" as idt ON sp."InteractionDWID" = idt."DWID" ' +
                    ' WHERE "Attribute.OriginalValue" = ?',
                    sAttr
                );
            }
            for (var iRow in resultSet) {
                var result = resultSet[iRow];
                if (sGroup !== result.Group) {
                    sGroup = result.Group;
                    sampleMap[sGroup] = [];
                }
                var value = result.Value;
                if (value === null) {
                    continue;
                }
                if (!sampleMap[sGroup][sAttr]) {
                    sampleMap[sGroup][sAttr] = {};
                }

                if (!sampleMap[sGroup][sAttr][value]) {
                    sampleMap[sGroup][sAttr][value] = [];
                }
                sampleMap[sGroup][sAttr][value].push(result.Sample);
            }
        }
        return sampleMap;
    }

    function createGroup(aSampleMap, aSplitList) {
        var aGroup = [];
        var aGroupName = [];
        var sGroup;
        for (var groupName in aSampleMap) {
            var tempGrp = {};
            sGroup = groupName === ('null' || null) ? "" : groupName;
            aGroupName.push(sGroup);
            var splitGroup = {};
            splitGroup[sGroup] = [];
            for (var iSplit = 0; iSplit < aSplitList.length; iSplit++) { //for eg. SampleClass, AnalysisDate
                var splitName = aSplitList[iSplit].trim();
                if (aSampleMap[groupName][splitName]) {
                    var oSplitData = aSampleMap[groupName][splitName];
                    tempGrp = JSON.parse(JSON.stringify(splitGroup));
                    splitGroup = {};
                    for (var sKey in oSplitData) { //for eg. GermLine, Tumor
                        for (var gName in tempGrp) { //for eg. group A
                            var sSplitGroupName = gName + ", " + sKey;
                            sSplitGroupName = sSplitGroupName.trim();
                            if (sSplitGroupName.startsWith(',')) {
                                sSplitGroupName = sSplitGroupName.slice(1);
                            }
                            splitGroup[sSplitGroupName] = [];
                            splitGroup[sSplitGroupName] = JSON.parse(JSON.stringify(tempGrp[gName]));
                            var aKeySample = aSampleMap[groupName][splitName][sKey];
                            if (iSplit === 0) {
                                splitGroup[sSplitGroupName] = aKeySample;
                            } else {
                                var aGroupSample = splitGroup[sSplitGroupName];
                                aGroupSample.filter(function (iSample) {
                                    return aKeySample.indexOf(iSample) !== -1;
                                });
                                splitGroup[sSplitGroupName] = aGroupSample;
                            }
                        }
                    }
                }
            }
            aGroup.push(splitGroup);
        }
        return { group: aGroup, groupName: aGroupName };
    }

    function mergeGroups(oGroup, aCategories) {
        var oMergedGroup = {};
        var aGroup = oGroup.group;
        var aGroupName = oGroup.groupName;
        var iGroup = 0;
        for (var m = 0; m < aGroupName.length; m++) {
            for (var i = 0; i < aCategories.length; i++) {
                var aCatGrp = aCategories[i].values;
                if (aCatGrp.length > 0) {
                    oMergedGroup[iGroup] = {};
                    var sLegend = aGroupName[m] === "" ? aCategories[i].name : aGroupName[m] + ", " + aCategories[i].name.trim();
                    oMergedGroup[iGroup].name = sLegend;
                    oMergedGroup[iGroup].categoryNumber = i + "";
                    oMergedGroup[iGroup].samples = [];
                    for (var j = 0; j < aCatGrp.length; j++) {
                        var sCatName = aGroupName[m] === "" ? aCatGrp[j] : aGroupName[m] + ", " + aCatGrp[j].trim();
                        for (var l = 0; l < aGroup.length; l++) {
                            if (aGroup[l][sCatName]) {
                                var aSampleIndex = aGroup[l][sCatName];
                                for (var k = 0; k < aSampleIndex.length; k++) {
                                    if (oMergedGroup[iGroup].samples.indexOf(aSampleIndex[k]) < 0) {
                                        oMergedGroup[iGroup].samples.push(aSampleIndex[k]);
                                    }
                                }
                            }
                        }
                    }
                    ++iGroup;
                }
            }
        }
        return oMergedGroup;
    }

    async function createGroupOnDate(context, oGroup, sampleGroupsTableName) {
        var aSampleDateMap = {}, oDateGroup = {}, iGroup = 0;
        var sQuery = 'SELECT sg."SampleIndex" AS "Sample", sp."AnalysisDate" AS "Value" FROM "' + sampleGroupsTableName + '" as sg ' +
            ' LEFT OUTER JOIN "hc.hph.genomics.db.models::General.Samples" as sp ON sg."SampleIndex" = sp."SampleIndex" ';
        var resultSet = await context.connection.executeQuery(sQuery);
        for (var iRow in resultSet) {
            var result = resultSet[iRow];
            var value = result.Value;
            if (value === null) {
                continue;
            }
            aSampleDateMap[result.Sample] = new Date(value).toLocaleString();
        }
        for (var index in oGroup) {
            var aDateSampleMap = {};
            for (var iSample = 0; iSample < oGroup[index].samples.length; iSample++) {
                var sDate = aSampleDateMap[oGroup[index].samples[iSample]];
                if (!aDateSampleMap[sDate]) {
                    aDateSampleMap[sDate] = [];
                }
                aDateSampleMap[sDate].push(oGroup[index].samples[iSample]);
            }
            for (var sDate in aDateSampleMap) {
                oDateGroup[iGroup] = {};
                oDateGroup[iGroup].name = oGroup[index].name + ", " + sDate;
                oDateGroup[iGroup].categoryNumber = oGroup[index].categoryNumber;
                oDateGroup[iGroup].samples = aDateSampleMap[sDate];
                iGroup++;
            }
        }
        return oDateGroup;
    }

    exports.initGroupsFromDataset = initGroupsFromDataset;
    exports.split = split;
    exports.getCategoryValue = getCategoryValue;
    exports.api = {
        initGroupsFromDataset: initGroupsFromDataset
    };

})(module.exports);