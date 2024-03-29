import http from "http";
import * as helper from "./postgresHelper";
import { OMOP_VERSIONS } from "../utils/config";

const app = require("../app");
const supertest = require("supertest");

const server = http.createServer(app);
server.setTimeout(300000);
const api = supertest(server);

const tenantDatabase: string = "alp";
const schema: string = "cdmtest";
const cleansedSchema: string = "cdmtest_cleansed";
const stagingAreaSchema: string = "fhir_data_integration_test";

beforeAll((done) => {
  // Start test from a fresh state
  helper.deleteDatabaseSchema(
    tenantDatabase,
    [schema, cleansedSchema, stagingAreaSchema],
    (result: boolean) => {
      done();
    }
  );
}, 600000);

describe("POST - API successful scenario integration test", () => {
  test("[Success] Get version information for multiple schemas", async (done) => {
    // Act
    const updateCount: number = 31;
    const outdatedSchema: string = "oldomopschema";
    const updatedSchema: string = "newpathologyschema";
    const nonExistantSchema: string = "nonexistantschema";

    // Create 3 schemas - 1 not updated, 1 fully updated, 1 that doesn't exist in the db
    try {
      await helper.deleteDatabaseSchema(
        tenantDatabase,
        [outdatedSchema, updatedSchema],
        (result: boolean) => {
          expect(result).toBe(true);
        }
      );

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
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${outdatedSchema}/update-count/${updateCount}`
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
          `/alpdb/postgres/database/${tenantDatabase}/data-model/pathology/schema/${updatedSchema}`
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
        .post(`/alpdb/postgres/database/${tenantDatabase}/version-info`)
        .send(exampleRequestBody);

      expect(getSchemasVersionInfoResponse.body).toEqual({
        message: "Retrieved version information for schemas",
        function: "Get Version Info",
        successfulSchemas: [
          {
            schemaName: outdatedSchema,
            dataModel: "omop5-4",
            currentVersionID: "omop5-4_V1.0.0.1.0",
            latestVersionID: "gdm_V1.0.0.0.4",
            updatesAvailable: true,
          },
          {
            schemaName: updatedSchema,
            dataModel: "pathology",
            currentVersionID: "pathology_v1.0.0.0.6",
            latestVersionID: "pathology_v1.0.0.0.6",
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

      await helper.deleteDatabaseSchema(
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
    const schema: string = "cdmtest";
    const cleansedSchema: string = "cdmtest_cleansed";
    try {
      const createCleansedSchemaResponse = await api
        .post(
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}`
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

      // TODO: Add function to check cdm_version of schema
      // // check CDM_VERSION is correct
      // const cdmVersionResponse = await api.get(
      //   `/alpdb/postgres/database/${tenantDatabase}/cdmversion/schema/${schema}`
      // );

      // const CDM_VERSION = cdmVersionResponse.body;

      // expect(CDM_VERSION).toEqual(OMOP_VERSIONS.OMOP5_4);

      await helper.deleteDatabaseSchema(
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

  test("[Success] Create new staging area schema", (done) => {
    const stagingAreaSchema: string = "fhir_data_integration_test";
    api
      .post(
        `/alpdb/postgres/database/${tenantDatabase}/staging-area/fhir_data/schema/${stagingAreaSchema}`
      )
      .then((response: any) => {
        expect(response.body).toEqual({
          message: "Schema successfully created and privileges assigned!",
          successfulSchemas: [stagingAreaSchema],
          failedSchemas: [],
          errorOccurred: false,
        });
      })
      .then(() => {
        helper.deleteDatabaseSchema(
          tenantDatabase,
          [stagingAreaSchema],
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

  test("[Success] Create Questionnaire Definition", async (done) => {
    // Create CDM schema
    api
      .post(
        `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}`
      )
      .send({
        cleansedSchemaOption: false,
        vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
      })
      .then((response: any) => {
        api
          .post(`/alpdb/postgres/database/${tenantDatabase}/schema/${schema}`)
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
          })
          .then((response: any) => {
            expect(response.body).toEqual({
              message:
                "Questionnaire definition record has been create sucessfully!",
              successfulSchemas: [schema],
              failedSchemas: [],
              errorOccurred: false,
            });
          })
          .then(() => {
            helper.deleteDatabaseSchema(
              tenantDatabase,
              [schema, cleansedSchema],
              (result: boolean) => {
                expect(result).toBe(true);
                done();
              }
            );
          });
      })
      .catch((err: Error) => {
        done(err);
      });
  }, 600000);

  test("[Success] Data import into schema", async (done) => {
    // Arrange
    const schema: string = "cdmtest";
    try {
      // Create schema
      const createSchemaResponse = await api
        .post(
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}`
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

      // Import data into source schema
      await api.put(
        `/alpdb/postgres/database/${tenantDatabase}/importdata?schema=${schema}`
      );
      const verifyPutSqlResponse = await helper.executeSqlPromise(
        tenantDatabase,
        `SELECT COUNT(*) AS COUNT FROM ${schema}.person`
      );
      expect(Number(verifyPutSqlResponse.rows[0].count)).toBeGreaterThan(0);

      // Teardown
      helper.deleteDatabaseSchema(
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
  }, 1200000);
});

describe("PUT - API successful scenario integration test", () => {
  test("[Success] Update an existing db schema created with update-count", async (done) => {
    // Arrange
    const updateCount: number = 31;

    try {
      await helper.deleteDatabaseSchema(
        tenantDatabase,
        [schema],
        (result: boolean) => {
          expect(result).toBe(true);
        }
      );

      // Apply a subset of omop5-4 changesets
      // create omop schema
      const createSubsetSchemaResponse = await api
        .post(
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}/update-count/${updateCount}`
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
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4?schema=${schema}`
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

      await helper.deleteDatabaseSchema(
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

  test("[Success] Update an existing db schema", async () => {
    // Arrange
    const defaultSchema = "cdmdefault";

    // Act
    const response = await api
      .put(
        `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4?schema=${defaultSchema}`
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
    // // check CDM_VERSION is correct
    // const cdmVersionResponse = await api.get(
    //   `/alpdb/postgres/database/${tenantDatabase}/cdmversion/schema/${defaultSchema}`
    // );

    // const CDM_VERSION = cdmVersionResponse.body;
    // expect(CDM_VERSION).toEqual(OMOP_VERSIONS.OMOP5_4);
  }, 600000);
});
// POST failure scenario test
describe.skip("POST - API failure scenario integration test", () => {
  test("[Failure due to schema already exist in database] Create new db schema", async () => {
    // Arrange
    const schemaThatAlreadyExistInDatabase: string = "cdmdefault";

    // Act
    const response = await api
      .post(
        `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schemaThatAlreadyExistInDatabase}`
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
      "invalid_$$_schema",
      "___invalid_schema",
      "***invalidschema",
    ];

    for (let i = 0; i < invalidSchemas.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${invalidSchemas[i]}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

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
      "**invalid",
      "&&missing",
      "wro$$ng",
    ];

    // Assert
    for (let i = 0; i < invalidTenantDatabases.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/postgres/database/${invalidTenantDatabases[i]}/data-model/omop5-4/schema/${schema}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

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
    const invalidTenantDatabases: string[] = ["invalid", "missing", "wrong"];

    // Assert
    for (let i = 0; i < invalidTenantDatabases.length; i++) {
      // Act
      const response = await api
        .post(
          `/alpdb/postgres/database/${invalidTenantDatabases[i]}/data-model/omop5-4/schema/${schema}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

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
      "invalid",
      "123abc",
      "_123!",
      "_123@abc",
    ];

    // Act
    for (let i = 0; i < invalidCounts.length; i++) {
      const response = await api
        .post(
          `/alpdb/postgres/database/${tenantDatabase}/data-model/omop5-4/schema/${schema}/update-count/${invalidCounts[i]}`
        )
        .send({
          cleansedSchemaOption: false,
          vocabSchema: process.env.OMOP__VOCAB_SCHEMA,
        });

      // Assert
      expect(response.body.errors[0]).toEqual({
        value: invalidCounts[i],
        msg: "Update count must be a unsigned number",
        param: "count",
        location: "params",
      });
    }
  }, 120000);
});

afterAll(() => {
  server.close();
});

// Dummy comment to activate db-svc integration test on github actions
