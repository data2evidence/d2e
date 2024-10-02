import {
  createPathInObject as createPath,
  createGuid as createId,
} from "@alp/alp-base-utils";
import { request2Bookmark } from "../../testutils/Request2Bookmark";
import * as async from "async";
import * as aggQuery from "../../../src/mri/endpoint/analytics";
import { Settings } from "../../../src/qe/settings/Settings";
import { testsLogger } from "../../testutils/logger";
import {
  testSuiteName,
  testSchemaName,
  pholderTableMap,
  testResult,
  Timer,
  aggquery_setup,
} from "../../testutils/aggquery_common";

let testEnvironment;
let connection;
let patientCreator;
let settingsObj;
const mockReq = {
  headers: {
    authorization: "Bearer dummy jwt",
    "x-alp-usersessionclaims": "test",
    "x-source-origin": "test",
  },
};

describe(testSuiteName, () => {
  beforeAll((done) => {
    aggquery_setup((_connection, _testEnvironment, _patientCreator) => {
      connection = _connection;
      testEnvironment = _testEnvironment;
      patientCreator = _patientCreator;
      settingsObj = new Settings();
      done();
    });
  });

  describe("excluded card in combination with a card of the same type --", () => {
    beforeAll((done) => {
      let patient1 = {};
      createPath(
        patient1,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        "COPP"
      );
      createPath(
        patient1,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        "COPP"
      );
      createPath(
        patient1,
        "patient.conditions.acme.interactions.chemo.3.attributes.chemo_prot",
        "COPP"
      );

      let patient2 = {};
      createPath(
        patient2,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        "COPP"
      );
      createPath(
        patient2,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        "ICE"
      );

      let patient3 = {};
      createPath(
        patient3,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        "FOLFOX"
      );
      createPath(
        patient3,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        "COPP"
      );

      let patient4 = {};
      createPath(
        patient4,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        "FOLFOX"
      );
      createPath(
        patient4,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        "ICE"
      );

      let patient5 = {};
      createPath(
        patient5,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        "FOLFOX"
      );

      let patient6 = {};
      createPath(
        patient6,
        "patient.conditions.acme.interactions.chemo.1._start",
        "01.01.1900"
      );

      let addPatient1 = (callback) => {
        patientCreator.addPatient(patient1, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient1...");
          callback(null);
        });
      };
      let addPatient2 = (callback) => {
        patientCreator.addPatient(patient2, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient2...");
          callback(null);
        });
      };
      let addPatient3 = (callback) => {
        patientCreator.addPatient(patient3, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient3...");
          callback(null);
        });
      };

      let addPatient4 = (callback) => {
        patientCreator.addPatient(patient4, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient4...");
          callback(null);
        });
      };
      let addPatient5 = (callback) => {
        patientCreator.addPatient(patient5, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient5...");
          callback(null);
        });
      };

      let addPatient6 = (callback) => {
        patientCreator.addPatient(patient6, null, (err, data) => {
          if (err) {
            throw err;
          }
          //log("Added Patient6...");
          callback(null);
        });
      };

      const clearSchema = (callback) => {
        testEnvironment.clearSchema((err, results) => {
          if (err) {
            console.error("Error in clearing schema tables!");
          }
          testsLogger("Cleared tables...");
          callback(null);
        });
      };

      async.series(
        [
          clearSchema,
          addPatient1,
          addPatient2,
          addPatient3,
          addPatient4,
          addPatient5,
          addPatient6,
        ],
        (err, data) => {
          if (err) {
            throw err;
          }
          //log("Completed adding patients ...");
          done();
        }
      );
    });

    afterAll((done) => {
      testEnvironment.clearSchema((err, results) => {
        //log("Cleaning tables...");
        if (err) {
          console.error("Error in clearing schema tables!");
        }
        //log("Cleared tables...");
        connection.close();
        done();
      });
    });

    it(`if the excluded card is empty and an attribute of the other card is put on the x-axis the result is empty (independent of the filter card ordering)
             (1)`, (done) => {
      let request1 = {};
      createPath(request1, "patient.attributes.pcount", [
        {
          yaxis: 1,
        },
      ]);
      createPath(
        request1,
        "patient.conditions.acme.interactions.chemo.1.exclude",
        true
      );
      createPath(
        request1,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        [
          {
            xaxis: 1,
          },
        ]
      );

      let t = new Timer();
      let expectedTotalPCount = 0;
      aggQuery.processRequest(
        "aggquery",
        mockReq,
        "mock_config", // configId
        "0", // configVersion
        "studyId_1", // studyId
        request2Bookmark(request1),
        "en",
        null, //config only required for domain_values_service & freetext_search_service
        connection,
        (err, res1) => {
          t.stop();
          if (err) {
            console.error(err);
            done.fail(err);
            return;
          }
          expect(res1.totalPatientCount).toEqual(expectedTotalPCount);
          testResult(
            res1,
            {
              "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot":
                [],
              "patient.attributes.pcount": [],
            },
            null
          );
          done();
        }
      );
    });

    it(`if the excluded card is empty and an attribute of the other card is put on the x-axis the result is empty
                (independent of the filter card ordering) (2)`, (done) => {
      let request2 = {};
      createPath(request2, "patient.attributes.pcount", [
        {
          yaxis: 1,
        },
      ]);
      createPath(
        request2,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        [
          {
            xaxis: 1,
          },
        ]
      );
      createPath(
        request2,
        "patient.conditions.acme.interactions.chemo.2.exclude",
        true
      );

      let t = new Timer();
      let expectedTotalPCount = 0;
      aggQuery.processRequest(
        "aggquery",
        mockReq,
        "mock_config", // configId
        "0", // configVersion
        "studyId_1", // studyId
        request2Bookmark(request2),
        "en",
        null, //config only required for domain_values_service & freetext_search_service
        connection,
        (err, res2) => {
          t.stop();
          if (err) {
            console.error(err);
            done.fail(err);
            return;
          }
          expect(res2.totalPatientCount).toEqual(expectedTotalPCount);
          testResult(
            res2,
            {
              "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot":
                [],
              "patient.attributes.pcount": [],
            },
            null
          );
          done();
        }
      );
    });

    it(`if the excluded card is has an entry in an attribute and the same attribute of the other card is put on the x-axis the result does not contain
             the excluded value (independent of the filter card ordering) (1)`, (done) => {
      let request1 = {};
      createPath(request1, "patient.attributes.pcount", [
        {
          yaxis: 1,
        },
      ]);
      createPath(
        request1,
        "patient.conditions.acme.interactions.chemo.1.exclude",
        true
      );
      createPath(
        request1,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        [
          {
            filter: [
              {
                op: "=",
                value: "COPP",
              },
            ],
          },
        ]
      );
      createPath(
        request1,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        [
          {
            xaxis: 1,
          },
        ]
      );

      let t = new Timer();
      let expectedTotalPCount = 3;
      aggQuery.processRequest(
        "aggquery",
        mockReq,
        "mock_config", // configId
        "0", // configVersion
        "studyId_1", // studyId
        request2Bookmark(request1),
        "en",
        null, //config only required for domain_values_service & freetext_search_service
        connection,
        (err, res1) => {
          t.stop();
          if (err) {
            console.error(err);
            done.fail(err);
            return;
          }
          expect(res1.totalPatientCount).toEqual(expectedTotalPCount);
          testResult(
            res1,
            {
              "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot":
                ["NoValue", "FOLFOX", "ICE"],
              "patient.attributes.pcount": [1, 2, 1],
            },
            null
          );
          done();
        }
      );
    });

    it(`if the excluded card is has an entry in an attribute and the same attribute of the other card is put on the x-axis the result does not contain
             the excluded value (independent of the filter card ordering) (2)`, (done) => {
      let request2 = {};
      createPath(request2, "patient.attributes.pcount", [
        {
          yaxis: 1,
        },
      ]);
      createPath(
        request2,
        "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot",
        [
          {
            xaxis: 1,
          },
        ]
      );
      createPath(
        request2,
        "patient.conditions.acme.interactions.chemo.2.exclude",
        true
      );
      createPath(
        request2,
        "patient.conditions.acme.interactions.chemo.2.attributes.chemo_prot",
        [
          {
            filter: [
              {
                op: "=",
                value: "COPP",
              },
            ],
          },
        ]
      );

      let t = new Timer();
      let expectedTotalPCount = 3;
      aggQuery.processRequest(
        "aggquery",
        mockReq,
        "mock_config", // configId
        "0", // configVersion
        "studyId_1", // studyId
        request2Bookmark(request2),
        "en",
        null, //config only required for domain_values_service & freetext_search_service
        connection,
        (err, res2) => {
          t.stop();
          if (err) {
            console.error(err);
            done.fail(err);
            return;
          }
          expect(res2.totalPatientCount).toEqual(expectedTotalPCount);
          testResult(
            res2,
            {
              "patient.conditions.acme.interactions.chemo.1.attributes.chemo_prot":
                ["NoValue", "FOLFOX", "ICE"],
              "patient.attributes.pcount": [1, 2, 1],
            },
            null
          );
          done();
        }
      );
    });
  });
});