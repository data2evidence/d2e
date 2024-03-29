(function (exports) {

    "use strict";

    let extensions = require(__base + "extensions");
    let error = require(__base + "error");
    let auditLib = require(__base + "auditLog");

    async function getSamples(context, parameters) {
        // error checks
        if (parameters.reference === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        if (parameters.chrom === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["chrom"]);
        }
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }
        if (parameters.position === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["position"]);
        }
        var position = parseInt(parameters.position, 10);
        if (isNaN(position) || (position < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["position", parameters.position]);
        }
        if (!parameters.splitPlugin) {
            throw new error.BioInfError("error.MissingRequestParameter", ["splitPlugin"]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        parameters = extensions.mergeParameters(parameters, { trackParameters: {}, groupsParameters: {}, groupsRequest: parameters.splitPlugin, mergeGroup: false, trackRequest: "vb.SampleSiteTracks.getGroupSamples" });
        parameters.trackParameters = extensions.mergeParameters(parameters.trackParameters, { reference: parameters.reference, chrom: chromosome, position: position, dataset: parameters.dataset });
        parameters.groupsParameters = extensions.mergeParameters(parameters.groupsParameters, parameters);
        var resultList = await extensions.getFunction("vb.TrackGroups.load")(context, parameters);

        var sampleGroups = [];
        var visiblePatientCount = 0;
        var totalPatientCount = 0;
        for (var resultIndex in resultList) {
            visiblePatientCount += resultList[resultIndex].result.visiblePatientCount;
            totalPatientCount += resultList[resultIndex].result.totalPatientCount;
            sampleGroups.push({ name: "" + resultList[resultIndex].name, patients: resultList[resultIndex].result.patients });
        }
        if (visiblePatientCount < totalPatientCount) {
            return {
                sampleGroups: sampleGroups,
                warning: { key: "siteTrack.PatientsExcluded", parameters: [totalPatientCount - visiblePatientCount, totalPatientCount] }
            };
        }
        else if (totalPatientCount === 0) {
            return {
                sampleGroups: sampleGroups,
                warning: { key: "siteTrack.NoPatientsFound", parameters: [] }
            };
        }
        else {
            return {
                sampleGroups: sampleGroups
            };
        }
    }

    async function getGroupSamples(context, parameters) {
        // error checks
        if (parameters.reference === undefined) {
            throw new error.BioInfError("error.MissingRequestParameter", ["reference"]);
        }
        var chromosome = parseInt(parameters.chrom, 10);
        if (isNaN(chromosome) || (chromosome < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["chrom", parameters.chrom]);
        }
        var position = parseInt(parameters.position, 10);
        if (isNaN(position) || (position < 0)) {
            throw new error.BioInfError("error.InvalidParameter", ["position", parameters.position]);
        }
        if (!parameters.dataset) {
            throw new error.BioInfError("error.MissingRequestParameter", ["dataset"]);
        }

        // query samples
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var getSampleList = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::SampleList");
        var result = await getSampleList(sampleListTableName, parameters.reference, chromosome, position, await context.getGlobalConfig("guardedTableMapping", "@PATIENT"));

        if(result.SAMPLES.length){
        const tempTable = await context.createTemporarySampleTable();
        await context.connection.executeBulkUpdate('INSERT INTO "' + tempTable + '" ("SampleIndex") VALUES (?)', result.SAMPLES.map(row => [row.SampleIndex]));
       // log accessed attributes
        await auditLib.logAttributes( context, tempTable, "VariantBrowser", "Patient", [
             { name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.FamilyName", successful: true },
             { name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.GivenName", successful: true },
             { name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.BirthDate", successful: true },
             { name: "hc.hph.cdw.db.models::DWEntities.Patient_Attr.Gender.OriginalValue", successful: true },
             { name: "hc.hph.genomics.db.models::General.Samples.PatientDWID", successful: true },
             { name: "hc.hph.genomics.db.models::General.Samples.AnalysisDate", successful: true },
             { name: "hc.hph.genomics.db.models::General.Samples.SampleClass", successful: true },
             { name: "hc.hph.genomics.db.models::General.Samples.InteractionDWID", successful: true },
             { name: "hc.hph.genomics.db.models::SNV.VariantAlleles.Allele", successful: true },
             { name: "hc.hph.genomics.db.models::SNV.GenotypeAlleles.AlleleCount", successful: true },
             { name: "hc.hph.genomics.db.models::General.Samples.ReferenceID", successful: true },
             { name: "hc.hph.genomics.db.models::SNV.Variants.ChromosomeIndex", successful: true },
             { name: "hc.hph.genomics.db.models::SNV.Variants.Position", successful: true }
         ], 1 ); 
        }

        var patients = [];
        for (var rowIndex in result.SAMPLES) {
            var row = result.SAMPLES[rowIndex];

            if ((patients.length === 0) || (patients[patients.length - 1].patientDWID !== row.PatientDWID)) {
                patients.push({
                    patientDWID: row.PatientDWID,
                    lastName: row.FamilyName,
                    firstName: row.GivenName,
                    birthDate: row.BirthDate,
                    gender: row.Gender,
                    samples: []
                });
            }
            var patient = patients[patients.length - 1];

            if ((patient.samples.length === 0) || (patient.samples[patient.samples.length - 1].sampleIndex !== row.SampleIndex)) {
                patient.samples.push({
                    sampleIndex: row.SampleIndex,
                    dwAuditId: row.DWAuditID,
                    interactionDWID: row.InteractionDWID,
                    dwSource: row.DWSource,
                    interactionId: row.InteractionID,
                    sampleClass: row.SampleClass,
                    date: row.AnalysisDate,
                    reference: row.AlleleIndex === 0 ? row.Allele : null,
                    alleles: []
                });
            }
            var sample = patient.samples[patient.samples.length - 1];

            if ((sample.alleles.length === 0) || (sample.alleles[sample.alleles.length - 1] !== row.Allele)) {
                for (var alleleCount = 0; alleleCount < row.AlleleCount; ++alleleCount) {
                    sample.alleles.push(row.Allele);
                }
            }
        }
        return {
            patients: patients,
            visiblePatientCount: result.VISIBLE_PATIENT_COUNT,
            totalPatientCount: result.TOTAL_PATIENT_COUNT
        };
    }

    async function getSampleAttributes(context, parameters) {
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var listSampleAttributes = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::SampleAttributes");
        var result = await listSampleAttributes(sampleListTableName);

        // log accessed attributes
        await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", [
             { name: "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details.Attribute.OriginalValue", successful: true },
             { name: "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details.Value.OriginalValue", successful: true }
         ], 1 ); 

        // convert query result to data structure
        var sampleAttributes = {};
        for (let row of result.SAMPLE_ATTRIBUTES) {
            var keyValuePairs = sampleAttributes[row.SampleIndex];
            if (!keyValuePairs) {
                keyValuePairs = [];
                sampleAttributes[row.SampleIndex] = keyValuePairs;
            }

            var attribute = row.Attribute;
            var keyValuePair = keyValuePairs[keyValuePairs.length - 1];
            if ((!keyValuePair) || (keyValuePair.key !== attribute)) {
                keyValuePair = { key: attribute, value: null, origin: "custom_sample_attribute" };
                keyValuePairs.push(keyValuePair);
            }

            if (!row.Value) {
                continue;
            }
            else if (Array.isArray(keyValuePair.value)) {
                keyValuePair.value.push(row.Value);
            }
            else if ((keyValuePair.value === null) || (keyValuePair.value === undefined)) {
                keyValuePair.value = row.Value;
            }
            else {
                keyValuePair.value = [keyValuePair.value, row.Value];
            }
        }

        // format output
        return parameters.sampleGroups.reduce(
            function (samples, sampleGroup) {
                return samples.concat(sampleGroup.patients.reduce(
                    function (patientSamples, patient) {
                        return patientSamples.concat(patient.samples.map(
                            function (sample) {
                                if (!sampleAttributes[sample.sampleIndex]) {
                                    sampleAttributes[sample.sampleIndex] = [];
                                }
                                if (sample.dwAuditId && context.httpRequest && context.httpRequest.authInfo && context.httpRequest.authInfo.checkLocalScope("hc.hph.plugins.vcf::Download"))
                                {
                                    sampleAttributes[sample.sampleIndex].push({
                                        key: "Source",
                                        value: "VCFFile",
                                        link: "/hc/hph/plugins/vcf/services/download/" + sample.dwAuditId,
                                        origin: "core_sample_attribute"
                                    });
                                }
                                return {
                                    sampleAttributes: sampleAttributes[sample.sampleIndex]
                                };
                            }
                        ));
                    },
                    []
                ));
            },
            []
        );
    }

    async function getVariantAttributes(context, parameters) {
        let sampleListTableName = await context.setSamplesFromDataset(parameters.dataset);
        var getVariantInfo = await context.connection.loadProcedure("hc.hph.genomics.db.procedures.vb::VariantInformation");
        var result = await getVariantInfo(sampleListTableName, parseInt(parameters.chrom, 10), parseInt(parameters.position, 10));
        var sampleVariants = {};
        var variant;
        var allele;
        var attributeName;
        var attributeValue;

        // log accessed attributes
        await auditLib.logAttributes( context, sampleListTableName, "VariantBrowser", "Patient", Array.from( result.ATTRIBUTES ).map(
              function ( oAttribute )
              {
                  return { name: oAttribute.SchemaName + '.' + oAttribute.TableName + '.' + oAttribute.AttributeName, successful: true };
              }
          ), 1 ); 

        // gather variants, filters and variant attributes
        for (let row of result.$resultSets[0]) {
            variant = { quality: row.Quality, ids: [], filters: [], variantAttributes: {}, alleles: [], genotypeAttributes: {}, zygosity: null };
            for (attributeName in row) {
                if (attributeName.startsWith("Filter.") && row[attributeName]) {
                    variant.filters.push(attributeName.substring(7));
                }
                if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                    variant.variantAttributes[attributeName.substring(5)] = row[attributeName];
                }
            }
            sampleVariants[row.SampleIndex] = variant;
        }

        // gather variant ids
        for (let row of result.$resultSets[1]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                variant.ids.push(row.VariantID);
            }
        }

        // gather variant alleles and variant allele attributes
        for (let row of result.$resultSets[2]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                allele = { allele: row.Allele, alleleCount: null, copyNumber: null, variantAttributes: {}, genotypeAttributes: {} };
                for (attributeName in row) {
                    if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                        allele.variantAttributes[attributeName.substring(5)] = row[attributeName];
                    }
                }
                variant.alleles[row.AlleleIndex] = allele;
            }
        }

        // gather variant multi-value attributes
        for (let row of result.$resultSets[3]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                for (attributeName in row) {
                    if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                        attributeValue = variant.variantAttributes[attributeName.substring(5)];
                        if (Array.isArray(attributeValue)) {
                            attributeValue.push(row[attributeName]);
                        }
                        else if ((attributeValue === null) || (attributeValue === undefined)) {
                            variant.variantAttributes[attributeName.substring(5)] = row[attributeName];
                        }
                        else {
                            variant.variantAttributes[attributeName.substring(5)] = [attributeValue, row[attributeName]];
                        }
                    }
                }
                variant.alleles[row.AlleleIndex] = allele;
            }
        }

        // gather variant structured attributes
        for (let row of result.$resultSets[4]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                for (attributeName in row) {
                    if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                        var attributeNameComponents = attributeName.substring(5).split('.');
                        attributeValue = variant.variantAttributes[attributeNameComponents[0]];
                        if (!attributeValue) {
                            attributeValue = [];
                            variant.variantAttributes[attributeNameComponents[0]] = attributeValue;
                        }
                        if (!attributeValue[row.ValueIndex]) {
                            attributeValue[row.ValueIndex] = {};
                        }
                        attributeValue[row.ValueIndex][attributeNameComponents.slice(1).join('.')] = row[attributeName];
                    }
                }
            }
        }

        // gather genotypes and genotype attributes
        for (let row of result.$resultSets[5]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                variant.copyNumber = row.CopyNumber;
                variant.zygosity = row.Zygosity ? row.Zygosity.replace(" ", "") : null;
                for (attributeName in row) {
                    if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                        variant.genotypeAttributes[attributeName.substring(5)] = row[attributeName];
                    }
                }
            }
        }

        // gather genotype allele attributes
        for (let row of result.$resultSets[6]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                allele = variant.alleles[row.AlleleIndex];
                if (allele) {
                    allele.alleleCount = row.AlleleCount;
                    for (attributeName in row) {
                        if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                            allele.genotypeAttributes[attributeName.substring(5)] = row[attributeName];
                        }
                    }
                }
            }
        }

        // gather genotype multi-value attributes
        for (let row of result.$resultSets[7]) {
            variant = sampleVariants[row.SampleIndex];
            if (variant) {
                for (attributeName in row) {
                    if (attributeName.startsWith("Attr.") && (row[attributeName] !== null)) {
                        attributeValue = variant.genotypeAttributes[attributeName.substring(5)];
                        if (Array.isArray(attributeValue)) {
                            attributeValue.push(row[attributeName]);
                        }
                        else if ((attributeValue === null) || (attributeValue === undefined)) {
                            variant.genotypeAttributes[attributeName.substring(5)] = row[attributeName];
                        }
                        else {
                            variant.genotypeAttributes[attributeName.substring(5)] = [attributeValue, row[attributeName]];
                        }
                    }
                }
            }
        }

        // format output
        return parameters.sampleGroups.reduce(
            function (samples, sampleGroup) {
                return samples.concat(sampleGroup.patients.reduce(
                    function (patientSamples, patient) {
                        return patientSamples.concat(patient.samples.map(
                            function (sample) {
                                if (!sampleVariants[sample.sampleIndex]) {
                                    return { variantAttributes: [] };
                                }

                                var attributeName;

                                var attributes = [
                                    {
                                        allele: null,
                                        attributes: [
                                            { key: "IDs", value: sampleVariants[sample.sampleIndex].ids, origin: "core_variant_attribute" },
                                            { key: "Quality", value: sampleVariants[sample.sampleIndex].quality, origin: "core_variant_attribute" },
                                            { key: "Filters", value: sampleVariants[sample.sampleIndex].filters, origin: "core_variant_attribute" },
                                            { key: "Zygosity", value: sampleVariants[sample.sampleIndex].zygosity, origin: "core_variant_attribute" }
                                        ]
                                    }
                                ];

                                for (attributeName in sampleVariants[sample.sampleIndex].variantAttributes) {
                                    attributes[0].attributes.push({ key: attributeName, value: sampleVariants[sample.sampleIndex].variantAttributes[attributeName], origin: "custom_variant_attribute" });
                                }
                                for (attributeName in sampleVariants[sample.sampleIndex].genotypeAttributes) {
                                    attributes[0].attributes.push({ key: attributeName, value: sampleVariants[sample.sampleIndex].genotypeAttributes[attributeName], origin: "custom_genotype_attribute" });
                                }

                                attributes = attributes.concat(sampleVariants[sample.sampleIndex].alleles.map(
                                    function (allele, alleleIndex) {
                                        var alleleAttributes = [
                                            { key: "AlleleType", value: alleleIndex === 0 ? "Reference" : "Alternative", origin: "core_genotype_attribute" },
                                            { key: "CalledAlleleCount", value: sampleVariants[sample.sampleIndex].copyNumber ? allele.alleleCount + '/' + sampleVariants[sample.sampleIndex].copyNumber : allele.alleleCount, origin: "core_genotype_attribute" }
                                        ];
                                        for (attributeName in allele.variantAttributes) {
                                            alleleAttributes.push({ key: attributeName, value: allele.variantAttributes[attributeName], origin: "custom_variant_attribute" });
                                        }
                                        for (attributeName in allele.genotypeAttributes) {
                                            alleleAttributes.push({ key: attributeName, value: allele.genotypeAttributes[attributeName], origin: "custom_genotype_attribute" });
                                        }
                                        return {
                                            allele: allele.allele,
                                            attributes: alleleAttributes
                                        };
                                    }
                                ));

                                return { variantAttributes: attributes };
                            }
                        ));
                    },
                    []
                ));
            },
            []
        );
    }

    // public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

    exports.getSamples = getSamples;
    exports.getGroupSamples = getGroupSamples;
    exports.getSampleAttributes = getSampleAttributes;
    exports.getVariantAttributes = getVariantAttributes;

    exports.api = {
        getSamples: getSamples,
        getGroupSamples: getGroupSamples,
        getSampleAttributes: getSampleAttributes,
        getVariantAttributes: getVariantAttributes,
    };

})(module.exports);