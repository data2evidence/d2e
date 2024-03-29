/*global jasmine, describe, beforeOnce, beforeEach, afterOnce, xit, it, expect, spyOn*/

var extensions = require(__base + 'extensions');
var error = require(__base + 'error');

var allSamples = ['9000944', '31000977', '31000931', '31000386', '31000875', '31000077', '31000821', '31000530', '31000570', '9000948', '31000631', '31000265', '31000267', '9000656', '9000694', '9000229', '31000552', '31000146', '9000742', '31000082'];
var visibleSamples = {
    '9000948': {
        'patientDWID': '54434741544347412D41502D41304C46',
        'lastName': 'Brown',
        'firstName': 'Deborah',
        'birthDate': new Date(1920, 8, 7),
        'gender': 'W',
        'samples': [
            {
                'sampleIndex': 9000948,
                'dwAuditId': 9000948,
                'interactionDWID': '54434741544347412D41502D41304C462D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-AP-A0LF-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2010, 9, 25),
                'reference': 'G',
                'alleles': ['G', 'T']
            }
        ]
    },
    '31000570': {
        'patientDWID': '54434741544347412D494E2D4136524A',
        'lastName': 'Gill',
        'firstName': 'Willie',
        'birthDate': new Date(1948, 2, 3),
        'gender': 'M',
        'samples': [
            {
                'sampleIndex': 31000570,
                'dwAuditId': 31000570,
                'interactionDWID': '54434741544347412D494E2D4136524A2D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-IN-A6RJ-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2013, 4, 29),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    },
    '9000694': {
        'patientDWID': '54434741544347412D41352D41304733',
        'lastName': 'Hoffarth',
        'firstName': 'Audrey',
        'birthDate': new Date(1946, 0, 27),
        'gender': 'W',
        'samples': [
            {
                'sampleIndex': 9000694,
                'dwAuditId': 9000694,
                'interactionDWID': '54434741544347412D41352D413047332D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-A5-A0G3-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2010, 2, 1),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    },
    '9000944': {
        'patientDWID': '54434741544347412D41502D41303539',
        'lastName': 'Milligan',
        'firstName': 'Roberta',
        'birthDate': new Date(1937, 1, 24),
        'gender': 'W',
        'samples': [
            {
                'sampleIndex': 9000944,
                'dwAuditId': 9000944,
                'interactionDWID': '54434741544347412D41502D413035392D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-AP-A059-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2010, 6, 1),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    },
    '31000530': {
        'patientDWID': '54434741544347412D44372D41364630',
        'lastName': 'Nebarez',
        'firstName': 'Velma',
        'birthDate': new Date(1934, 7, 4),
        'gender': 'W',
        'samples': [
            {
                'sampleIndex': 31000530,
                'dwAuditId': 31000530,
                'interactionDWID': '54434741544347412D44372D413646302D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-D7-A6F0-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2013, 10, 18),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    },
    '9000656': {
        'patientDWID': '54434741544347412D41502D4130354A',
        'lastName': 'Similien',
        'firstName': 'Kathy',
        'birthDate': new Date(1942, 7, 10),
        'gender': 'W',
        'samples': [
            {
                'sampleIndex': 9000656,
                'dwAuditId': 9000656,
                'interactionDWID': '54434741544347412D41502D4130354A2D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-AP-A05J-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2010, 2, 14),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    },
    '31000386': {
        'patientDWID': '54434741544347412D46502D41344245',
        'lastName': 'Thompkins',
        'firstName': 'Justin',
        'birthDate': new Date(1957, 5, 21),
        'gender': 'M',
        'samples': [
            {
                'sampleIndex': 31000386,
                'dwAuditId': 31000386,
                'interactionDWID': '54434741544347412D46502D413442452D303141',
                'dwSource': 'TCGA',
                'interactionId': 'TCGA-FP-A4BE-01A',
                'sampleClass': 'Primary Tumor',
                'date': new Date(2013, 0, 27),
                'reference': 'G',
                'alleles': ['G', 'A']
            }
        ]
    }
};
var globalParameters = {
    splitPlugin: 'vb.TrackGroups.getSessionSamples',
    dataset: 'sample:' + allSamples.join(','),
    reference: 'GRCh37',
    chrom: 16,
    position: 7577120
};
var numberOfSamples = allSamples.length;
var numberOfMatchingSamples = 16;
var numberOfVisibleSamples = Object.keys(visibleSamples).length;

async function getVariants(context) {
    return Object.keys(visibleSamples).reduce(
        async function (affectedVariants, sampleIndex) {
            return (await affectedVariants).concat(await context.connection.executeQuery(
                'SELECT v."DWAuditID", v."VariantIndex" FROM "hc.hph.genomics.db.models::SNV.Variants" as v INNER JOIN "hc.hph.genomics.db.models::SNV.Genotypes" as g ON g."DWAuditID" = v."DWAuditID" AND g."VariantIndex" = v."VariantIndex" WHERE g."SampleIndex" = ? AND v."ChromosomeIndex" = ? AND v."Position" = ?',
                sampleIndex,
                globalParameters.chrom,
                globalParameters.position
            ));
        },
        Promise.resolve([])
    );
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('SampleSiteTrack', function () {

    beforeEach(async function () {
        var affectedRows;
        await initDefaultContext();
        affectedRows = await context.connection.executeUpdate('UPDATE "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" SET "OrgID" = \'200\' WHERE "DWID" IN ( SELECT "InteractionDWID" FROM "hc.hph.genomics.db.models::General.Samples" WHERE MOD( "SampleIndex", 2 ) = 0 )'); // make some patients visible but do not commit
        expect(affectedRows).toBeGreaterThan(0); // .because( "there should be at least some genomics interactions affected" )
        affectedRows = await context.connection.executeUpdate('UPDATE "hc.hph.cdw.db.models::DWEntities.Interactions_Attr" SET "OrgID" = \'999\' WHERE "DWID" IN ( SELECT "InteractionDWID" FROM "hc.hph.genomics.db.models::General.Samples" WHERE MOD( "SampleIndex", 2 ) = 1 )'); // make other patients invisible but do not commit
        expect(affectedRows).toBeGreaterThan(0); // .because( "there should be at least some genomics interactions affected" )
    });

    afterEach(cleanUp);

   /* it('Missing parameters in getSamples', async function () {
        await Promise.all(Object.keys(globalParameters).map(async function (missingParameter) {
            try {
                var parameters = extensions.mergeParameters(globalParameters);
                delete parameters[missingParameter];
                await context.getExtension('vb.SampleSiteTracks.getSamples')(parameters);
                expect(true).toBe(false); // .because( "we should have failed with an error" );
            }
            catch (exception) {
                expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
                expect(exception.errorCode).toBe('error.MissingRequestParameter'); // .because( "we did not provide a mandatory parameter" );
                expect(exception.parameters).toEqual([missingParameter]); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
            }
        }));
    });*/

    /*it('Invalid parameters in getSamples', async function () {
        await Promise.all([
            { key: 'chrom', value: 'xyz' },
            { key: 'chrom', value: -1 },
            { key: 'position', value: 'xyz' },
            { key: 'position', value: -1 }
        ].map(async function (replacement) {
            try {
                var parameters = extensions.mergeParameters(globalParameters);
                parameters[replacement.key] = replacement.value;
                await context.getExtension('vb.SampleSiteTracks.getSamples')(parameters);
                expect(true).toBe(false); // .because( "we should have failed with an error" );
            }
            catch (exception) {
                expect(exception).toEqual(jasmine.any(error.BioInfError)); // .because( "we are expecting no other error" );
                expect(exception.errorCode).toBe('error.InvalidParameter'); // .because( "we provided an invalid value" );
                expect(exception.parameters).toEqual([replacement.key, replacement.value]); // .because( "we require those parameters for the error message and want to be sure that the error was triggered by the expected parameter" );
            }
        }));
    });*/

    /*it('Correctness of getSamples results', async function () {
        try {
            var result = await context.getExtension('vb.SampleSiteTracks.getSamples')(globalParameters);

            // validate groups
            expect(result).toBeDefined(); // .because( "of the API definition of getSamples" );
            expect(result.sampleGroups).toBeDefined(); // .because( "of the API definition of getSamples" );
            expect(result.sampleGroups).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSamples" );
            expect(result.sampleGroups.length).toBe(numberOfSamples); // .because( "number of groups should equal number of samples if we split the groups base on the sample id" );

            // validate patients
            result.sampleGroups.forEach(function (group) {
                expect(group).toBeDefined(); // .because( "of the API definition of getSamples" );
                expect(group.name).toBeDefined(); // .because( "of the API definition of getSamples" );
                expect(group.patients).toBeDefined(); // .because( "of the API definition of getSamples" );
                expect(group.name).toEqual(jasmine.any(String)); // .because( "of the API definition of getSamples" );
                expect(group.patients).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSamples" );
                expect(group.patients.length).toBe(visibleSamples[group.name] ? 1 : 0); // .because( "there should be at most 1 sample per group if we split the groups based on the sample id" );

                group.patients.forEach(function (patient) {
                    // harmonize dates since toEqual does not do that for us (unlike toEqualObject which is not supported)
                    patient.birthDate = new Date(patient.birthDate);
                    patient.samples[0].date = new Date(patient.samples[0].date);
                    expect(patient).toEqual(visibleSamples[patient.samples[0].sampleIndex]);
                });
            });

            // validate counts
            expect(result.warning).toBeDefined(); // .because( "of the API definition of getSamples" );
            expect(result.warning.key).toEqual('siteTrack.PatientsExcluded'); // .because( "of the API definition of getSamples" );
            expect(result.warning.parameters).toBeDefined(); // .because( "of the API definition of getSamples" );
            expect(result.warning.parameters).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSamples" );
            expect(result.warning.parameters.length).toBe(2); // .because( "of the API definition of getSamples" );
            expect(result.warning.parameters[0]).toBe(numberOfMatchingSamples - numberOfVisibleSamples); // .because( "only patients with a variant at the given position for whom we have privileges to see details are reported" );
            expect(result.warning.parameters[1]).toBe(numberOfMatchingSamples); // .because( "only patients with a variant at the given position are considered" );
        }
        catch (exception) {
            expect(exception).toBe(undefined, exception.stack); // .because( "no error should be thrown in this block" );
        }
    });*/

    /*it('Correctness of getSampleAttributes results', async function () {
        var expectedSampleAttributes = [
            {
                key: 'ReferenceGenome',
                value: 'GRCh37',
                origin: 'custom_sample_attribute'
            },
            {
                key: 'SampleClass',
                value: ['Primary Tumor', 'Visible'],
                origin: 'custom_sample_attribute'
            }
        ];*/
        /*
        if (context.httpRequest.authInfo.checkLocalScope("")) {
            expectedSampleAttributes.push({
                key: 'Source',
                value: 'VCFFile',
                origin: 'core_sample_attribute'
            });
        }
        */

       /* try {
            var affectedRows = await context.connection.executeUpdate('INSERT INTO "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" ( "DWID", "DWAuditID", "DWDateFrom", "DWDateTo", "Attribute.OriginalValue", "Value.OriginalValue" ) SELECT "DWID", "DWAuditID", "DWDateFrom", "DWDateTo", \'SampleClass\' AS "Attribute.OriginalValue", CASE WHEN MOD( CAST( "Value.OriginalValue" AS INTEGER ), 2 ) = 0 THEN \'Visible\' ELSE \'Invisible\' END AS "Value.OriginalValue" FROM "hc.hph.cdw.db.models::DWEntitiesEAV.Interaction_Details" WHERE "Attribute.OriginalValue" = \'SampleIndex\''); // make some patients visible but do not commit
            expect(affectedRows).toBeGreaterThan(0); // .because( "there should be at least some genomics interactions affected" )

            var sampleResult = await context.getExtension('vb.SampleSiteTracks.getSamples')(globalParameters);
            var result = await context.getExtension('vb.SampleSiteTracks.getSampleAttributes')(extensions.mergeParameters(globalParameters, sampleResult));

            sampleResult.sampleGroups = sampleResult.sampleGroups.filter(
                function (sampleGroup) {
                    return sampleGroup.patients.length > 0;
                }
            );

            // validate samples
            expect(result).toBeDefined(); // .because( "of the API definition of getSampleAttributes" );
            expect(result).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSampleAttributes" );
            expect(result.length).toBe(numberOfVisibleSamples); // .because( "only visible samples will return results" );

            // validate sample attributes
            result.forEach(function (sample, sampleGroupIndex) {
                expect(sample.sampleAttributes).toBeDefined(); // .because( "of the API definition of getSampleAttributes" );
                expect(sample.sampleAttributes).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSampleAttributes" );
                expect(sample.sampleAttributes.length).toBe(expectedSampleAttributes.length); // .because( "each valid sample should return two attributes" );

                expect(sample.sampleAttributes[0]).toEqual(expectedSampleAttributes[0]);
                expect(sample.sampleAttributes[1]).toEqual(expectedSampleAttributes[1]);
                if (expectedSampleAttributes.length > 2) {
                    expectedSampleAttributes[2].link = '/hc/hph/plugins/vcf/services/download/' + sampleResult.sampleGroups[sampleGroupIndex].name;
                    expect(sample.sampleAttributes[2]).toEqual(expectedSampleAttributes[2]);
                }
            });
        }
        catch (exception) {
            expect(exception).toBe(undefined, exception.stack); // .because( "no error should be thrown in this block" );
        }
    });*/

    /*it('Correctness of getVariantAttributes results', async function () {
        var expectedVariantAttributes = [
            {
                allele: null,
                attributes:
                    [
                        {
                            key: 'IDs',
                            value: [],
                            origin: 'core_variant_attribute'
                        },
                        {
                            key: 'Quality',
                            value: 30.0,
                            origin: 'core_variant_attribute'
                        },
                        {
                            key: 'Filters',
                            value: ['PASS'],
                            origin: 'core_variant_attribute'
                        },
                        {
                            key: 'Zygosity',
                            value: null,
                            origin: 'core_variant_attribute'
                        }
                    ]
            },
            {
                attributes:
                    [
                        {
                            key: 'AlleleType',
                            value: 'Reference',
                            origin: 'core_genotype_attribute'
                        },
                        {
                            key: 'CalledAlleleCount',
                            value: '1/2',
                            origin: 'core_genotype_attribute'
                        }
                    ]
            },
            {
                attributes:
                    [
                        {
                            key: 'AlleleType',
                            value: 'Alternative',
                            origin: 'core_genotype_attribute'
                        },
                        {
                            key: 'CalledAlleleCount',
                            value: '1/2',
                            origin: 'core_genotype_attribute'
                        }
                    ]
            }
        ];

        try {
            var variants = await getVariants(context);

            await Promise.all(variants.map(function (variant) {
                return context.connection.executeUpdate(
                    'UPDATE "hc.hph.genomics.db.models::SNV.Variants" SET "Filter.PASS" = 1, "Quality" = 30.0 WHERE "DWAuditID" = ? AND "VariantIndex" = ?',
                    variant.DWAuditID,
                    variant.VariantIndex
                );
            }));

            var sampleResult = await context.getExtension('vb.SampleSiteTracks.getSamples')(globalParameters);
            var result = await context.getExtension('vb.SampleSiteTracks.getVariantAttributes')(extensions.mergeParameters(globalParameters, sampleResult));

            sampleResult.sampleGroups = sampleResult.sampleGroups.filter(
                function (sampleGroup) {
                    return sampleGroup.patients.length > 0;
                }
            );

            // validate samples
            expect(result).toBeDefined(); // .because( "of the API definition of getSampleAttributes" );
            expect(result).toEqual(jasmine.any(Array)); // .because( "of the API definition of getSampleAttributes" );
            expect(result.length).toBe(numberOfVisibleSamples); // .because( "only visible samples will return results" );

            // validate variant attributes
            result.forEach(function (sample, sampleGroupIndex) {
                expect(sample.variantAttributes).toBeDefined(); // .because( "of the API definition of getVariantAttributes" );
                expect(sample.variantAttributes).toEqual(jasmine.any(Array)); // .because( "of the API definition of getVariantAttributes" );
                expect(sample.variantAttributes.length).toBe(visibleSamples[sampleResult.sampleGroups[sampleGroupIndex].name] ? expectedVariantAttributes.length : 0); // .because( "each valid sample should one gneric list of attributes and one per allele" );

                if (visibleSamples[sampleResult.sampleGroups[sampleGroupIndex].name]) {
                    expectedVariantAttributes[0].attributes[0].value = sample.variantAttributes[0].attributes[0].value.length > 0 ? ['rs121913343'] : [];
                    expect(sample.variantAttributes[0]).toEqual(expectedVariantAttributes[0]);
                    expectedVariantAttributes[1].allele = sampleResult.sampleGroups[sampleGroupIndex].patients[0].samples[0].alleles[0];
                    expect(sample.variantAttributes[1]).toEqual(expectedVariantAttributes[1]);
                    expectedVariantAttributes[2].allele = sampleResult.sampleGroups[sampleGroupIndex].patients[0].samples[0].alleles[1];
                    expect(sample.variantAttributes[2]).toEqual(expectedVariantAttributes[2]);
                }
            });
        }
        catch (exception) {
            expect(exception).toBe(undefined, exception.stack); // .because( "no error should be thrown in this block" );
        }
    }); */
});
