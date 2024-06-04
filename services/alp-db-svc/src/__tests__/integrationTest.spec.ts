import http from "http";
import * as helper from "./helper";
import { OMOP_VERSIONS } from "../utils/config";

// Setup API server for integration test
const app = require("../app");
const supertest = require("supertest");

const server = http.createServer(app);
server.setTimeout(900000);
const api = supertest(server);

const rand: number = helper.getRandomNumber(1000);
const tenantDatabase: string = "ALPDEV";
const schema: string = "CDMINTEGRATIONTESTDONOTUSE" + rand;
const cleansedSchema: string = schema + "_CLEANSED";

beforeAll((done) => {
  // Start test from a fresh state
  helper.deleteDatabaseSchemaAndAuditPolicy(
    tenantDatabase,
    [schema, cleansedSchema],
    (result: boolean) => {
      done();
    }
  );
}, 600000);

describe("POST - API successful scenario integration test", () => {
  test("[Success] Get version information for multiple schemas", async (done) => {
    // Act
    const updateCount: number = 1;
    const outdatedSchema = "OLDOMOPSCHEMA" + rand;
    const updatedSchema = "NEWPATHOLOGYSCHEMA" + rand;
    const nonExistantSchema: string = "nonexistantschema";

    // Create 3 schemas - 1 not updated, 1 fully updated, 1 that doesn't exist in the db

    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          outdatedSchema,
          updatedSchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const exampleRequestBody = {
        token: "exampletoken",
        datasetListFromPortal: [
          {
            database_code: tenantDatabase,
            schema_name: outdatedSchema,
            study_id: outdatedSchema,
            data_model: "omop5-4",
          },
          {
            database_code: tenantDatabase,
            schema_name: updatedSchema,
            study_id: updatedSchema,
            data_model: "pathology",
          },
          {
            database_code: tenantDatabase,
            schema_name: nonExistantSchema,
            study_id: nonExistantSchema,
          },
        ],
      };

      // create omop schema
      const createOutdatedSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schema/${outdatedSchema}/update-count/${updateCount}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createOutdatedSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [outdatedSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const createUpdatedSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/pathology/schema/${updatedSchema}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createUpdatedSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [updatedSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const getSchemasVersionInfoResponse = await api
        .post(`/alpdb/hana/database/${tenantDatabase}/version-info`)
        .send(exampleRequestBody);

      expect(getSchemasVersionInfoResponse.body).toEqual({
        message: "Retrieved version information for schemas",
        function: "Get Version Info",
        successfulSchemas: [
          {
            schemaName: outdatedSchema,
            dataModel: "omop5-4",
            currentVersionID: "omop_V5.2.2.1.1",
            latestVersionID: "questionnaire_V1.0.0.0.5",
            updatesAvailable: true,
          },
          {
            schemaName: updatedSchema,
            dataModel: "pathology",
            currentVersionID: "pathology_v1.0.0.0.5",
            latestVersionID: "pathology_v1.0.0.0.5",
            updatesAvailable: false,
          },
        ],
        failedSchemas: [
          {
            schemaName: nonExistantSchema,
          },
        ],
        errorOccured: true,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [outdatedSchema, updatedSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 300000);

  test("[Success] Create new db schema with cleansed schema", async (done) => {
    try {
      const createCleansedSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}`
        )
        .send({
          cleansedSchemaOption: true,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createCleansedSchemaResponse.body).toEqual({
        message:
          "Schema & Cleansed Schema successfully created and privileges assigned!",
        successfulSchemas: [schema, cleansedSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [schema, cleansedSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 600000);

  test("[Success] Create source schema, data import into source schema, create schema snapshot from source schema", async (done) => {
    // Arrange
    const sourceSchema: string = "CDMINTEGRATIONTESTSNAPSHOTSOURCE" + rand;
    const snapshotWindowDateTime: string = "2008-01-01 00:00:00";
    const snapshotCopyConfig = {
      timestamp: snapshotWindowDateTime,
    };
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          sourceSchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      // Create source schema
      const createSourceSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schema/${sourceSchema}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });
      expect(createSourceSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [sourceSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      // Import data into source schema
      await api.put(
        `/alpdb/hana/database/${tenantDatabase}/importdata?schema=${sourceSchema}`
      );
      const verifyPutSqlResponse = await helper.executeSqlPromise(
        tenantDatabase,
        `SELECT COUNT(*) AS COUNT FROM ${sourceSchema}.PERSON`
      );
      expect(verifyPutSqlResponse[0].COUNT).toBeGreaterThan(0);

      // TODO: Add function to check cdm_version of schema
      // // check CDM_VERSION is correct
      // const cdmVersionResponse = await api.get(
      //   `/alpdb/hana/database/${tenantDatabase}/cdmversion/schema/${sourceSchema}`
      // );

      // const CDM_VERSION = cdmVersionResponse.body;

      // expect(CDM_VERSION).toEqual(OMOP_VERSIONS.OMOP5_4);

      // Act on schema snapshot from source schema
      const snapshotResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schemasnapshot/${schema}?sourceschema=${sourceSchema}`
        )
        .send({ snapshotCopyConfig: snapshotCopyConfig });
      // Assert schema snapshot from source schema
      expect(snapshotResponse.body).toEqual({
        message: "Schema snapshot successfully created!",
        successfulSchemas: [`${schema}`],
        failedSchemas: [],
        errorOccurred: false,
      });

      // Assert schema snapshot from source schema
      const verifyPostSqlResponse = await helper.executeSqlPromise(
        tenantDatabase,
        `SELECT COUNT(*) AS COUNT FROM ${schema}.PERSON`
      );
      expect(verifyPostSqlResponse[0].COUNT).toBeGreaterThan(0);

      // Teardown
      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [sourceSchema, schema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 1200000); // This test case takes a longer time to run due to import-data step

  //Test creating Questionnaire definition
  test("[Success] Create Questionnaire Definition", async (done) => {
    // Create CDM schema
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          schema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [schema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const createQuestionnaireDefinitionResponse = await api
        .post(`/alpdb/hana/database/${tenantDatabase}/schema/${schema}`)
        .send({
          definition: JSON.stringify({
            resourceType: "Questionnaire",
            id: "f205",
            text: {
              status: "generated",
              div: '<div xmlns="http://www.w3.org/1999/xhtml">\n      <pre>Lifelines Questionnaire 1 part 1\n  1. Do you have allergies?\n  2. General Questions:\n    2.a) What is your gender?\n    2.b) What is your date of birth?\n    2.c) What is your country of birth?\n    2.d) What is your marital status?\n    3. Intoxications:\n      3.a) Do you smoke?\n      3.b) Do you drink alcohol?</pre>\n    </div>',
            },
            url: "http://hl7.org/fhir/Questionnaire/f201",
            status: "active",
            experimental: true,
            subjectType: "['Patient']",
            date: "2010",
            code: [
              {
                system: "http://example.org/system/code/lifelines/nl",
                code: "VL 1-1, 18-65_1.2.2",
                display: "Lifelines Questionnaire 1 part 1",
              },
            ],
            item: [
              {
                linkId: "1",
                text: "Do you have allergies?",
                type: "boolean",
              },
              {
                linkId: "2",
                text: "General questions",
                type: "group",
                item: [
                  {
                    linkId: "2.1",
                    text: "What is your gender?",
                    type: "string",
                  },
                  {
                    linkId: "2.2",
                    text: "What is your date of birth?",
                    type: "date",
                  },
                  {
                    linkId: "2.3",
                    text: "What is your country of birth?",
                    type: "string",
                  },
                  {
                    linkId: "2.4",
                    text: "What is your marital status?",
                    type: "string",
                  },
                ],
              },
              {
                linkId: "3",
                text: "Intoxications",
                type: "group",
                item: [
                  {
                    linkId: "3.1",
                    text: "Do you smoke?",
                    type: "boolean",
                  },
                  {
                    linkId: "3.2",
                    text: "Do you drink alchohol?",
                    type: "boolean",
                  },
                ],
              },
            ],
          }),
        });

      expect(createQuestionnaireDefinitionResponse.body).toEqual({
        message: "Questionnaire definition record has been create sucessfully!",
        successfulSchemas: [schema],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [schema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 600000);

  // Test create dataCharacterization results schema
  test("[Success] Create new dataCharacterization results schema", async (done) => {
    // Generate timestamp based dataCharacterization results schema name
    const dataCharacterizationResultsSchema = `${schema}_DATA_CHARACTERIZATION_${Date.now()}`;
    try {
      const response = await api
        .post(
          `/alpdb/hana/dataCharacterization/database/${tenantDatabase}/schema/${dataCharacterizationResultsSchema}`
        )
        .send({
          cdmSchema: schema,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(response.body).toEqual({
        message:
          "DataCharacterization results schema successfully created and privileges assigned!",
        successfulSchema: dataCharacterizationResultsSchema,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [dataCharacterizationResultsSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      // If any error, try to delete schema as well
      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [dataCharacterizationResultsSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done(err);
        }
      );
    }
  }, 600000);
});

describe("POST & PUT [MS] - API successful scenario integration test", () => {
  test("[Success] Create new OMOP DEID schema without cleansed schema", async (done) => {
    const msDEIDSchema = "CDMMSDEID" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msDEIDSchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createOmopDeidSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/custom-omop-ms/schema/${msDEIDSchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createOmopDeidSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msDEIDSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const createMSDEIDSchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/custom-omop-ms?schema=${msDEIDSchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createMSDEIDSchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [msDEIDSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msDEIDSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 300000);

  test("[Success] Create new OMOP PHI schema without cleansed schema", async (done) => {
    const msPHISchema = "CDMMSPHI" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msPHISchema,
        ]);

      expect(deleteSchemaResult).toBe(true);

      const createOmopPhiSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/custom-omop-ms-phi/schema/${msPHISchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createOmopPhiSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msPHISchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const createMSPHISchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/custom-omop-ms-phi?schema=${msPHISchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createMSPHISchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [msPHISchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msPHISchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 300000);

  test("[Success] Create new Pathology schema without cleansed schema", async (done) => {
    const msPathologySchema = "CDMMSPATHOLOGY" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msPathologySchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createPathologySchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/pathology/schema/${msPathologySchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createPathologySchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msPathologySchema],
        failedSchemas: [],
        errorOccurred: false,
      });
      const updatePathologySchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/pathology?schema=${msPathologySchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(updatePathologySchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [`${msPathologySchema}`],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msPathologySchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 300000);

  test("[Success] Create new Bio-Me schema without cleansed schema", async (done) => {
    const msBioMeSchema = "CDMMSBIOME" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msBioMeSchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createBioMeSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/bio-me/schema/${msBioMeSchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createBioMeSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msBioMeSchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const updateBioMeSchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/bio-me?schema=${msBioMeSchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(updateBioMeSchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [`${msBioMeSchema}`],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msBioMeSchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done();
    }
  }, 300000);

  test("[Success] Create new Radiology schema without cleansed schema", async (done) => {
    const msRadiologySchema = "CDMMSRADIOLOGY" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msRadiologySchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createRadiologySchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/radiology/schema/${msRadiologySchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createRadiologySchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msRadiologySchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const updateRadiologySchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/radiology?schema=${msRadiologySchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(updateRadiologySchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [`${msRadiologySchema}`],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msRadiologySchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done();
    }
  }, 300000);

  test("[Success] Create new APPKPI schema without cleansed schema", async (done) => {
    const msAPPKPISchema = "CDMMSAPPKPI" + rand;
    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          msAPPKPISchema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      const createAPPKPISchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/radiology/schema/${msAPPKPISchema}/update-count/1`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createAPPKPISchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [msAPPKPISchema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const updateAPPKPISchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/radiology?schema=${msAPPKPISchema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(updateAPPKPISchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [`${msAPPKPISchema}`],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [msAPPKPISchema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done();
    }
  }, 300000);
});

describe("PUT - API successful scenario integration test", () => {
  test("[Success] Update an existing db schema created with update-count", async (done) => {
    // Arrange
    const updateCount: number = 1;

    try {
      const deleteSchemaResult =
        await helper.deleteDatabaseSchemaAndAuditPolicyPromise(tenantDatabase, [
          schema,
        ]);
      expect(deleteSchemaResult).toBe(true);

      // Apply a subset of omop5-4 changesets
      // create omop schema
      const createSubsetSchemaResponse = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}/update-count/${updateCount}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(createSubsetSchemaResponse.body).toEqual({
        message: "Schema successfully created and privileges assigned!",
        successfulSchemas: [schema],
        failedSchemas: [],
        errorOccurred: false,
      });

      const updateSubsetSchemaResponse = await api
        .put(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4?schema=${schema}`
        )
        .send({
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      expect(updateSubsetSchemaResponse.body).toEqual({
        message: "All schemas updated successfully!",
        successfulSchemas: [schema],
        failedSchemas: [],
        errorOccurred: false,
      });

      helper.deleteDatabaseSchemaAndAuditPolicy(
        tenantDatabase,
        [schema],
        (result: boolean) => {
          expect(result).toBe(true);
          done();
        }
      );
    } catch (err) {
      done(err);
    }
  }, 600000);

  test.skip("[Success] Update an existing db schema", async () => {
    // Arrange
    const defaultSchema = "CDMDEFAULT";

    // Act
    const response = await api
      .put(
        `/alpdb/hana/database/${tenantDatabase}/data-model/omop5-4?schema=${defaultSchema}`
      )
      .send({
        vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
      });

    // Assert
    expect(response.body).toEqual({
      message: "All schemas updated successfully!",
      successfulSchemas: [`${defaultSchema}`],
      failedSchemas: [],
      errorOccurred: false,
    });

    // TODO: Add function to check cdm_version of schema
    // // check CDM_VERSION is updated to 5.4
    // const cdmVersionResponse = await api.get(
    //   `/alpdb/hana/database/${tenantDatabase}/cdmversion/schema/${defaultSchema}`
    // );

    // const CDM_VERSION = cdmVersionResponse.body;

    // expect(CDM_VERSION).toEqual(OMOP_VERSIONS.OMOP5_4);
  }, 600000);

  // Disabled due to sporadic failings and longer GHA running time. Lower priority.
  // Should be used locally for testing during development
  test.skip("[Success] Update maintenance script", async () => {
    // Arrange
    const adminSchema = "TENANT_ADMIN_USER";

    // Act
    const response = await api.put(
      `/alpdb/hana/database/${tenantDatabase}/maintenance/schema/${adminSchema}`
    );

    // Assert
    expect(response.body).toEqual({
      message: "Maintenance script updated successfully!",
      successfulSchemas: [`${adminSchema}`],
      failedSchemas: [],
      errorOccurred: false,
    });
  }, 600000);
});

// Skip POST failure scenario test in Github Action to speed up test and also reduce the amount of error log
// Should be used locally for testing during development
describe.skip("POST - API failure scenario integration test", () => {
  test("[Failure due to schema already exist in database] Create new db schema", async () => {
    // Arrange
    const schemaThatAlreadyExistInDatabase: string = "CDMDEFAULT";

    // Act
    const response = await api
      .post(
        `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schema/${schemaThatAlreadyExistInDatabase}`
      )
      .send({
        cleansedSchemaOption: false,
        vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
      });

    // Assert
    expect(response.body).toEqual({
      message: "Schema creation failed! Error: ",
      successfulSchemas: [],
      failedSchemas: [`${schemaThatAlreadyExistInDatabase}`],
      errorOccurred: true,
    });
  }, 120000);

  test("[Failure due to special character in schema] Create new db schema", async () => {
    // Arrange
    const invalidSchemas: string[] = [
      "INVALID_$$_SCHEMA",
      "___INVALID_SCHEMA",
      "***INVALIDSCHEMA",
    ];

    for (let i = 0; i < invalidSchemas.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schema/${invalidSchemas[i]}`
        )
        .send({ vocabSchema: process.env.OMOP__VOCAB_SCHEMA });

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: invalidSchemas[i],
        msg: "Schema name is invalid",
        param: "schema",
        location: "params",
      });
    }
  }, 120000);

  test("[Failure due to special character in tenant database] Create new db schema", async () => {
    // Arrange
    const invalidTenantDatabases: string[] = [
      "**INVALID",
      "&&MISSING",
      "WRO$$NG",
    ];

    // Assert
    for (let i = 0; i < invalidTenantDatabases.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/hana/database/${invalidTenantDatabases[i]}/data-model/omop/schema/${schema}`
        )
        .send({ vocabSchema: process.env.OMOP__VOCAB_SCHEMA });

      expect(response.body.errors[0]).toEqual({
        value: invalidTenantDatabases[i],
        msg: "Invalid value",
        param: "tenant",
        location: "params",
      });
    }
  }, 120000);

  test("[Failure due to invalid tenant database] Create new db schema", async () => {
    // Arrange
    const invalidTenantDatabases: string[] = ["INVALID", "MISSING", "WRONG"];

    // Assert
    for (let i = 0; i < invalidTenantDatabases.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/hana/database/${invalidTenantDatabases[i]}/data-model/omop/schema/${schema}`
        )
        .send({ vocabSchema: process.env.OMOP__VOCAB_SCHEMA });

      expect(response.body.errors[0]).toEqual({
        value: invalidTenantDatabases[i],
        msg: "Invalid value",
        param: "tenant",
        location: "params",
      });
    }
  }, 120000);

  test("[Failure due to invalid update count] Create new db schema", async () => {
    // Arrange
    const invalidCounts: string[] = [
      "-1",
      "INVALID",
      "123ABC",
      "_123!",
      "_123@ABC",
    ];

    // Act
    for (let i = 0; i < invalidCounts.length; i++) {
      const response = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schema/${schema}/update-count/${invalidCounts[i]}`
        )
        .send({ vocabSchema: process.env.OMOP__VOCAB_SCHEMA });

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: invalidCounts[i],
        msg: "Update count must be a unsigned number",
        param: "count",
        location: "params",
      });
    }
  }, 120000);

  test("[Failure due to invalid dataCharacterization results schema name] Create new dataCharacterization results schema", async () => {
    // Arrange
    const invalidDataCharacterizationResultsSchemas: string[] = [
      "INVALIDSCHEMA_DATA_CHARACTERIZATION_",
      "INVALIDSCHEMA_DATA_CHARACTERIZATION_1686656321", // seconds timestamp epoch
      "INVALIDSCHEMA_DATA_CHARAC_1686656321785",
      "_DATA_CHARACTERIZATION_1686656321785",
    ];

    // Act
    for (const invalidDataCharacterizationResultsSchema of invalidDataCharacterizationResultsSchemas) {
      const response = await api.post(
        `/alpdb/hana/dataCharacterization/database/${tenantDatabase}/schema/${invalidDataCharacterizationResultsSchema}`
      );

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: invalidDataCharacterizationResultsSchema,
        msg: "DataCharacterization results schema name is invalid",
        param: "schema",
        location: "params",
      });
    }
  }, 120000);

  test("[Failure due to invalid timestamp] Create schema snapshot", async () => {
    // Arrange
    const sourceSchema = "CDMTEST14JUN";
    const invalidSnapshotWindowsDateTime: string[] = [
      "0000-00-00 00:00:00",
      "2020-30-30 30:30:30",
      "2020/12/12 30:30:30",
      "2020-12-12T00:00:00",
      "2020-12-12 00:00:00Z",
      "2020-14-30 00:00:00",
      "2020-12-99 00:00:00",
      "2020-12-99 00.00.00",
      "2020-12-99 00:00:00:001",
    ];

    // Act
    for (let i = 0; i < invalidSnapshotWindowsDateTime.length; i++) {
      const snapshotCopyConfig = {
        timestamp: invalidSnapshotWindowsDateTime[i],
      };
      const response = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schemasnapshot/${schema}?sourceschema=${sourceSchema}`
        )
        .send({ snapshotCopyConfig: snapshotCopyConfig });

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: { timestamp: invalidSnapshotWindowsDateTime[i] },
        msg: "timestamp must be in the format YYYY-MM-DD HH:mm:ss",
        param: "snapshotCopyConfig",
        location: "body",
      });
    }
  }, 120000);

  test("[Failure due to invalid source schema name] Create schema snapshot", async () => {
    // Arrange
    const snapshotWindowsDateTime: string = "2021-07-02 00:00:00";
    const invalidSourceSchema: string[] = [
      "INVALIDSCHEMA",
      "CWHAT",
      "DWHAT",
      "MWHAT",
      "CDWHAT",
    ];
    const snapshotCopyConfig = {
      timestamp: snapshotWindowsDateTime,
    };

    // Act
    for (let i = 0; i < invalidSourceSchema.length; i++) {
      const response = await api
        .post(
          `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schemasnapshot/${schema}?sourceschema=${invalidSourceSchema[i]}`
        )
        .send({ snapshotCopyConfig: snapshotCopyConfig });

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: invalidSourceSchema[i],
        msg: "Source schema name is invalid",
        param: "sourceschema",
        location: "query",
      });
    }
  }, 120000);

  test("[Failure due to source schema does not exist in tenant database] Create schema snapshot", (done) => {
    // Arrange
    const invalidSourceSchema: string = "CDMXXXXXXXXXXXINVALID";
    const snapshotWindowsDateTime: string = "2021-07-02 00:00:00";
    const snapshotCopyConfig = { timestamp: snapshotWindowsDateTime };
    // Act
    api
      .post(
        `/alpdb/hana/database/${tenantDatabase}/data-model/omop/schemasnapshot/${schema}?sourceschema=${invalidSourceSchema}`
      )
      .send({ snapshotCopyConfig: snapshotCopyConfig })
      .then((response: any) => {
        // Assert
        expect(response.body).toEqual({
          message: "Create snapshot failure. Source schema not found.",
          successfulSchemas: [],
          failedSchemas: [invalidSourceSchema],
          errorOccurred: true,
        });
      })
      .then(() => {
        // Teardown
        helper.deleteDatabaseSchemaAndAuditPolicy(
          tenantDatabase,
          [schema],
          (result: boolean) => {
            expect(result).toBe(true);
            done();
          }
        );
      })
      .catch((err: Error) => {
        done(err);
      });
  }, 600000);
});

// Skip PUT failure scenario test in Github Action to speed up test and also reduce the amount of error log
// Should be used locally for testing during development
describe.skip("PUT - API failure scenario integration test", () => {
  test("[Failure due to schema is not TENANT_ADMIN_USER] Update maintenance script", async () => {
    // Arrange
    const invalidAdminSchema: string = "CDMDEFAULT";

    // Act
    const response = await api.put(
      `/alpdb/hana/database/${tenantDatabase}/maintenance/schema/${invalidAdminSchema}`
    );

    // Assert
    expect(response.body.errors[0]).toEqual({
      value: invalidAdminSchema,
      msg: "Maintenance user schema name is invalid",
      param: "schema",
      location: "params",
    });
  }, 120000);
});

afterAll(() => {
  server.close();
});
