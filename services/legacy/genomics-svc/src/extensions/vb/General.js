(function (exports) {

    "use strict";

    let error = require(__base + "error");
    let hgvs = require(__base + "hgvs");
    let sampleGroups = require(__base + "extensions/SampleGroups");

    async function getQueryInfo(context, parameters) {
        return await context.sendRequest('mri-svc', {
            method: "POST",
            path: "/hc/mri/pa/services/analytics.xsjs",
            queryParameters: { action: "genomics" },
            body: {
                filter: parameters.filterCardQuery,
                language: "",
                axisSelection: []
            }
        }, 10)
        .then(
            body => {
                let queryInfo = {
                    query: body.queryObject.queryString,
                    columns: body.columnObjects,
                    parameterValues: []
                };
                for (let parameter of body.queryObject.parameterPlaceholders) {
                    queryInfo.query = queryInfo.query.replace(parameter.key, "?");
                    queryInfo.parameterValues.push(parameter.value);
                }
                return queryInfo;
            }
        );
    }

    async function getChromosomes(context, parameters) {
        var resultSet;
        var rowIndex;
        var referenceID = parameters.reference;
        if (!parameters.reference) {
            var result = await getGenomeReference(context, parameters);
            referenceID = result.reference;
        }
        // get chromosome information
        resultSet = await context.connection.executeQuery(
            'select "ChromosomeIndex", "ChromosomeName", "Size", "Topology", "Visible" from "hc.hph.genomics.db.models::Reference.Chromosomes" where "ReferenceID" = ?',
            referenceID
        );
        if (resultSet.length === 0) {
            throw new error.BioInfError("error.NoReferenceChromosome", [referenceID]);
        }
        var chromosomeInfos = { list: [], variantCount: 0 };
        for (rowIndex in resultSet) {
            var chromosomeIndex = resultSet[rowIndex].ChromosomeIndex;
            while (chromosomeInfos.list.length <= chromosomeIndex) {
                chromosomeInfos.list.push({ cytobands: [] });
            }
            var chromosome = chromosomeInfos.list[chromosomeIndex];
            chromosome.name = resultSet[rowIndex].ChromosomeName;
            chromosome.size = resultSet[rowIndex].Size;
            chromosome.circular = (resultSet[rowIndex].Topology === 'Circular');
            chromosome.visible = (resultSet[rowIndex].Visible !== 0);
        }

        // get cytoband and centromere information

        resultSet = await context.connection.executeQuery(
            'select "ChromosomeIndex", "Class", "FeatureID", "FeatureName", "Region.Begin" as "Begin", "Region.End" as "End", "Score" from "hc.hph.genomics.db.models::Reference.Features" where "ReferenceID" = ? and "Class" IN ( \'centromere\', \'cytoband\' ) order by "ChromosomeIndex", "Class", "Region.Begin", "Region.End"',
            parameters.reference
        );
        for (rowIndex in resultSet) {
            var chromosomeIndex = resultSet[rowIndex].ChromosomeIndex;
            if (chromosomeIndex >= chromosomeInfos.list.length) {
                continue;
            }
            var chromosome = chromosomeInfos.list[chromosomeIndex];
            var featureClass = resultSet[rowIndex].Class;
            if (featureClass === 'centromere') {
                if (!chromosome.centromere) {
                    chromosome.centromere = { begin: resultSet[rowIndex].Begin, end: resultSet[rowIndex].End, center: null };
                    var imbalance = resultSet[rowIndex].Score;
                    if (imbalance !== null) {
                        chromosome.centromere.center = Math.round(chromosome.centromere.begin + (imbalance + 0.5) * (chromosome.centromere.end - chromosome.centromere.begin));
                    }
                }
                else {
                    chromosome.centromere.center = Math.round((chromosome.centromere.end + resultSet[rowIndex].Begin) / 2);
                    chromosome.centromere.end = resultSet[rowIndex].End;
                }
            }
            else if (featureClass === 'cytoband') {
                chromosome.cytobands.push({ begin: resultSet[rowIndex].Begin, end: resultSet[rowIndex].End, score: resultSet[rowIndex].Score, name: resultSet[rowIndex].FeatureName });
            }
        }

        if (chromosome.centromere && (chromosome.centromere.center === null)) {
            chromosome.centromere.center = Math.round((chromosome.centromere.begin + chromosome.centromere.end) / 2);
        }


        return chromosomeInfos;
    }

    async function searchFeature(context, parameters) {
        await context.getExtension("search.searchField.saveSearchHistory")(parameters);
        var result = await hgvs.locate(context, parameters.reference, parameters.query);
        if (result.length === 0) {
            throw new error.BioInfError("error.FeatureNotFound", [parameters.query, parameters.reference]);
        }
        else if (result.length > 1) {
            result = result.filter(function (translation) { return translation.canonical; }); // extract canonical transcript only if possible
            if (result.length === 1) {
                return result[0];
            }
            else {
                throw new error.BioInfError("error.TooManyResults", [parameters.query, parameters.reference]);
            }
        }
        else {
            return result[0];
        }
    }

    async function getAnnotations(context, parameters) {
        if (parameters.variantType === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["variantType"]);
        }
        if (parameters.table === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["table"]);
        }
        var result = [], resultSet, rowIndex;
        // get anotation information
        resultSet = await context.connection.executeQuery(
            'SELECT DISTINCT("' + parameters.variantType.replace('"', '""') + '") as "name" FROM "hc.hph.genomics.db.models::SNV.' + parameters.table.replace('"', '""') + '"'
        );

        for (rowIndex in resultSet) {
            result.push({ value: resultSet[rowIndex].name });
        }

        return result;
    }

    async function getGenomeReference(context, parameters) {
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var referenceID;
        var resultSet = await context.connection.executeQuery(
            ' SELECT DISTINCT "ReferenceID" ' +
            ' FROM "' + sampleListTableName + '" as "SampleList" ' +
            ' JOIN "hc.hph.genomics.db.models::General.Samples" as "Sample" ' +
            ' ON "SampleList"."SampleIndex" = "Sample"."SampleIndex" ');
        if (resultSet.length > 1) {
            var reference = [];
            for (var rowIndex in resultSet) {
                if (reference) {
                    reference.push(resultSet[rowIndex].ReferenceID);
                }
                throw new error.BioInfError("error.MultipleReferenceGenome", [reference, parameters.dataset.split(":")[1]]);
            }
        }
        else if (resultSet.length === 0) {
            throw new error.BioInfError("error.NoData");
        } else {
            referenceID = resultSet[0].ReferenceID;
            if (parameters.reference && referenceID !== parameters.reference) {
                throw new error.BioInfError("error.ReferenceGenomeMismatch", [parameters.reference, referenceID]);
            } else {
                return { reference: referenceID };
            }
        }
    }

    /**
     * Groups annotations regarding to VB's configuration
     * Joins sample list table provided in parameters.sampleListTableName
     * Be sure to fill it through context.setSamplesFromDataset
     **/
    async function getAnnotationGrouping(context, parameters) {
        //Check if Variant Browser is configured regarding grouping
        if (parameters.annotationConfig && parameters.annotationConfig.groupConfig && parameters.annotationConfig.groupConfig.categories.length !== 0) {
            var tableName = await context.createTemporaryVariantGroupingTable();
            var sQuery = 'SELECT src."DWAuditID", src."VariantIndex", ' + ((parameters.annotationConfig.groupConfig.table === 'Variants' || parameters.annotationConfig.groupConfig.table === 'Genotypes') ? 'NULL AS "AlleleIndex"' : 'src."AlleleIndex" ') + ', CASE ';
            var sQueryFrom = 'FROM "hc.hph.genomics.db.models::SNV.' + parameters.annotationConfig.groupConfig.table.replace('"', '""') + '" AS src RIGHT OUTER JOIN "hc.hph.genomics.db.models::SNV.Genotypes" AS gt ON src."DWAuditID" = gt."DWAuditID" AND src."VariantIndex" = gt."VariantIndex" INNER JOIN "' + parameters.sampleListTableName + '" AS samples ON gt."SampleIndex" = samples."SampleIndex"';

            var aAttributes = [];
            var iCategoryCount = 0;
            //Extend attributes array for where clause
            var aExtendedAttributes = [];
            var bQueryHasNull = false;
            var iValueCount = 0;
            for (var n = 0; n < parameters.annotationConfig.groupConfig.categories.length; n++) {
                //Only create when statement when category is not empty
                if (parameters.annotationConfig.groupConfig.categories[n].values.length > 0) {
                    iCategoryCount++;
                    sQuery += 'WHEN ( src."' + parameters.annotationConfig.groupConfig.attribute.replace('"', '""') + '" ';
                    var bGroupHasNull = false;
                    var bInList = false;
                    for (var m = 0; m < parameters.annotationConfig.groupConfig.categories[n].values.length; m++) {
                        if (m === 0) {
                            if (parameters.annotationConfig.groupConfig.categories[n].values.length === 1 && parameters.annotationConfig.groupConfig.categories[n].values[m] === 'null') {
                                //No IN list
                                bQueryHasNull = true;
                                sQuery += 'IS NULL ';
                            } else {
                                iValueCount++;
                                bInList = true;
                                sQuery += 'IN (';
                            }
                        }
                        if (parameters.annotationConfig.groupConfig.categories[n].values[m] === 'null') {
                            bGroupHasNull = true;
                            bQueryHasNull = true;
                        } else {
                            aAttributes.push(parameters.annotationConfig.groupConfig.categories[n].values[m]);
                            aExtendedAttributes.push(parameters.annotationConfig.groupConfig.categories[n].values[m]);
                            sQuery += '?,';
                        }
                    }
                    //Close IN list only if it was opened
                    if (bInList) {
                        sQuery = sQuery.slice(0, -1);
                        sQuery += ') ';
                    }
                    if (bGroupHasNull && parameters.annotationConfig.groupConfig.categories[n].values.length > 1) {
                        sQuery += 'OR src."' + parameters.annotationConfig.groupConfig.attribute.replace('"', '""') + '" IS NULL ';
                    }
                    //Close WHEN
                    sQuery += ') THEN ' + n + ' ';
                }
            }

            sQuery += 'ELSE NULL END AS "Grouping" ' + sQueryFrom + ' WHERE src."' + parameters.annotationConfig.groupConfig.attribute.replace('"', '""') + '"';
            if (iValueCount > 0) {
                sQuery += ' IN (';
                for (var i = 0; i < aAttributes.length; i++) {
                    sQuery += '?,';
                    aExtendedAttributes.push(aAttributes[i]);
                }
                sQuery = sQuery.slice(0, -1);
                sQuery += ') ';

                //Add IS NULL in WHERE Condition
                if (bQueryHasNull) {
                    sQuery += 'OR src."' + parameters.annotationConfig.groupConfig.attribute.replace('"', '""') + '" IS NULL ';
                }
            } else {
                sQuery += ' IS NULL ';
            }

            sQuery += 'AND gt."ReferenceAlleleCount" < gt."CopyNumber"';

            if (parameters.filterCardQuery && parameters.filterCardQuery.instance && parameters.filterCardQuery.instance !== 'All') {
                sQuery = 'SELECT annoGrp."DWAuditID", annoGrp."VariantIndex", annoGrp."AlleleIndex", annoGrp."Grouping" FROM ( ' + sQuery + ' ) AS annoGrp';
                var queryObject = await getQueryInfo(context, parameters);
                sQuery += ' INNER JOIN (' + queryObject.query + ') ON ';
                for (var columnKey in queryObject.columns) {
                    if (queryObject.columns[columnKey].annotation === "genomics_dw_audit_id") {
                        sQuery += 'annoGrp."DWAuditID" = "' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AND ';
                    } else if (queryObject.columns[columnKey].annotation === "genomics_variant_index") {
                        sQuery += 'annoGrp."VariantIndex" = "' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AND ';
                    } else if (queryObject.columns[columnKey].annotation === "genomics_allele_index" && (parameters.annotationConfig.groupConfig.table !== 'Variants' || parameters.annotationConfig.groupConfig.table !== 'Genotypes')) {
                        sQuery += 'annoGrp."AlleleIndex" = "' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AND ';
                    }
                }
                sQuery = sQuery.substring(0, sQuery.lastIndexOf("AND"));
                aExtendedAttributes = aExtendedAttributes.concat(queryObject.parameterValues);
            }
            let sQueryArr = [`INSERT INTO "${tableName}" ${sQuery}`];
            sQueryArr = sQueryArr.concat(aExtendedAttributes);
            await context.connection.executeQuery.apply(context.connection, sQueryArr);
            return { intermediateResults: tableName, categoryCount: iCategoryCount };
        } else {
            return null;
        }
    }

    async function getCustomAttributes(context, parameters) {

        var sTable = parameters.table;
        var aAttributes = [];

        var resultSet;
        switch (sTable) {
            case 'Variants':
                //Get filters
                var sQuery = 'SELECT "AttributeName", "Description" FROM "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" ' +
                    'WHERE "Level" = \'Filter\' AND "DataType" = \'Flag\' AND "ArraySize" = 0 AND "Active" = 1 ORDER BY "AttributeName"';

                resultSet = await context.connection.executeQuery(sQuery);
                for (var rowIndex in resultSet) {
                    aAttributes.push({ type: 'Filter', attribute: resultSet[rowIndex].AttributeName, description: resultSet[rowIndex].Description });
                }

                var sQuery = 'SELECT "AttributeName", "DataType", "Description" FROM "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" ' +
                    'WHERE "Level" = \'Variant\' AND "DataType" IN ( \'Flag\', \'Character\', \'String\' ) AND "ArraySize" < 2 AND "Active" = 1 ORDER BY "AttributeName"';
                break;
            case 'VariantAlleles':
                var sQuery = 'SELECT "AttributeName", "DataType", "Description" FROM "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" ' +
                    'WHERE "Level" = \'VariantAllele\' AND "DataType" IN ( \'Flag\', \'Character\', \'String\' ) AND "ArraySize" < 2 AND "Active" = 1 ORDER BY "AttributeName"';
                break;
            case 'Genotypes':
                var sQuery = 'SELECT "AttributeName", "DataType", "Description" FROM "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" ' +
                    'WHERE "Level" = \'Genotype\' AND "DataType" IN ( \'Flag\', \'Character\', \'String\' ) AND "ArraySize" < 2 AND "Active" = 1 ORDER BY "AttributeName"';
                break;
            case 'GenotypeAlleles':
                var sQuery = 'SELECT "AttributeName", "DataType", "Description" FROM "hc.hph.genomics.db.models.extensions::Attribute.CustomAttributes" ' +
                    'WHERE "Level" = \'GenotypeAllele\' AND "DataType" IN ( \'Flag\', \'Character\', \'String\' ) AND "ArraySize" < 2 AND "Active" = 1 ORDER BY "AttributeName"';
                break;
        }

        if (sQuery) {
            resultSet = await context.connection.executeQuery(sQuery);

            for (var rowIndex in resultSet) {
                aAttributes.push({ type: 'Attr', attribute: resultSet[rowIndex].AttributeName, description: resultSet[rowIndex].Description });
            }
        }

        return aAttributes;
    }

    async function upsertBrowserConfiguration(context, parameters) {
        var oConfig = {};
        // Rank 100 is used for saving configuration
        var sQuery = 'SELECT "Configuration", "Rank" FROM "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" WHERE "User" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') AND "Application" = ? AND "Rank" = 100';
        var resultSet = await context.connection.executeQuery(sQuery, parameters.application);
        if (resultSet.length === 1) {
            oConfig = JSON.parse(resultSet[0].Configuration);
        }
        //upsert using configuration
        for (var oConfigType in parameters.browserConfiguration) {
            oConfig[oConfigType] = parameters.browserConfiguration[oConfigType];
        }
        var sUpsert = 'UPSERT "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" ("User", "Created", "LastUpdated", "Configuration", "Application", "Rank") VALUES ( SESSION_CONTEXT(\'XS_APPLICATIONUSER\'), CURRENT_UTCTIMESTAMP, CURRENT_UTCTIMESTAMP, ?, ?, 100) WHERE "User" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') AND "Application" = ?';
        await context.connection.executeUpdate(sUpsert, JSON.stringify(oConfig), parameters.application, parameters.application);
        await context.connection.commit();
        return {};
    }

    async function getBrowserConfiguration(context, parameters) {
        var sQuery = 'SELECT TO_VARCHAR("Configuration") AS "Configuration" FROM "hc.hph.genomics.db.models::VariantBrowser.BrowserConfiguration" WHERE ( "User" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') OR "User" IS NULL ) AND ( "Application" = ? OR "Application" IS NULL ) ORDER BY "Rank" DESC';
        var resultSet = await context.connection.executeQuery(sQuery, parameters.application);
        var oBrowserConfig = {};
        for (var i = 0; i < parameters.config.length; i++) {
            var oConfigType = parameters.config[i];
            if (resultSet.length > 0) {
                for (var row in resultSet) {
                    var oConfig = JSON.parse(resultSet[row].Configuration);
                    if (oConfig[oConfigType]) {
                        oBrowserConfig[oConfigType] = oConfig[oConfigType];
                        break;
                    } else {
                        if (!(oConfigType === 'groupConfig' || oConfigType === 'sampleConfig')) { // do not send empty objects to the UI
                            oBrowserConfig[oConfigType] = {};
                        }
                    }
                }
            }
        }
        return oBrowserConfig;
    }

    async function getSampleCategory(context, parameters) {
        var aSplit = parameters.split ? parameters.split.split(',') : parameters.annotationConfig.sampleConfig.sampleCategory;
        var categoryValues = await sampleGroups.getCategoryValue(context, aSplit);
        return { groupNames: categoryValues };
    }

    async function getGenomicInteraction(context, parameters) {
        var sQuery = 'SELECT DISTINCT "Attribute.OriginalValue" AS "Attribute" FROM "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" AS "Attr" INNER JOIN "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" AS "Details" ON "Attr"."DWID" = "Details"."DWID" WHERE "InteractionType.OriginalValue" = \'Genomic\' ';
        var resultSet = await context.connection.executeQuery(sQuery);
        var interactionAttr = [];
        for (var rowIndex in resultSet) {
            var sAttr = resultSet[rowIndex].Attribute;
            if (sAttr === 'SampleClass' || sAttr === 'ReferenceGenome' || sAttr === 'SampleIndex') {
                continue;
            }
            interactionAttr.push(sAttr);
        }
        return { interactionAttr: interactionAttr };
    }

    async function getGenomicFilterData(context, parameters) {
        var queryObject = await getQueryInfo(context, parameters);
        var tableName = await context.createTemporaryVariantGroupingTable();
        var sQuery = 'INSERT INTO "' + tableName + '" SELECT ';
        let selectedAttributes = [null, null, null];
        for (var columnKey in queryObject.columns) {
            if (queryObject.columns[columnKey].annotation === "genomics_dw_audit_id") {
                selectedAttributes[0] = '"' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AS "DWAuditID", ';
            } else if (queryObject.columns[columnKey].annotation === "genomics_variant_index") {
                selectedAttributes[1] = '"' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AS "VariantIndex", ';
            } else if (queryObject.columns[columnKey].annotation === "genomics_allele_index") {
                selectedAttributes[2] = '"' + queryObject.columns[columnKey].columnName.replace('"', '""') + '" AS "AlleleIndex", ';
            }
        }
        sQuery += selectedAttributes.join('');
        sQuery += ' 0 AS "Grouping" FROM (' + queryObject.query + ')';
        var sQueryArr = [sQuery];
        sQueryArr = sQueryArr.concat(queryObject.parameterValues);
        await context.connection.executeQuery.apply(context.connection, sQueryArr);
        return { intermediateResults: tableName };
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getAnnotationGrouping = getAnnotationGrouping;
    exports.getChromosomes = getChromosomes;
    exports.getBrowserConfiguration = getBrowserConfiguration;
    exports.upsertBrowserConfiguration = upsertBrowserConfiguration;
    exports.getSampleCategory = getSampleCategory;
    exports.getGenomicInteraction = getGenomicInteraction;
    exports.searchFeature = searchFeature;
    exports.getGenomeReference = getGenomeReference;
    exports.getGenomicFilterData = getGenomicFilterData;
    exports.getCustomAttributes = getCustomAttributes;
    exports.getAnnotations = getAnnotations;
    exports.api = {
        getAnnotationGrouping: getAnnotationGrouping,
        getGenomeReference: getGenomeReference,
        getChromosomes: getChromosomes,
        getBrowserConfiguration: getBrowserConfiguration,
        getSampleCategory: getSampleCategory,
        getGenomicInteraction: getGenomicInteraction,
        searchFeature: searchFeature,
        getCustomAttributes: getCustomAttributes,
        getAnnotations: getAnnotations,
        upsertBrowserConfiguration: upsertBrowserConfiguration,
    };

})(module.exports);
