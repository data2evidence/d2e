import { dbSvcConverter, vcapSvcConverter } from "./envConverter";
import combinedJson from "./jsons/combinedJson.json";
import envVcapJson from "./jsons/envVcapJson.json";
import dbSvcPostgresJson from "./jsons/dbSvcPostgresJson.json";
import dbSvcHanaJson from "./jsons/dbSvcHanaJson.json";
import { CombinedEnv } from "./types";
import {
  filterServiceCredentials,
  processForComposeDbSvc,
  serviceNames,
} from "./processForCompose";

const deepCopy = <T>(obj: any) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

describe("Conversion from env to Db svc format", () => {
  it("empty config should remain empty", () => {
    expect(dbSvcConverter([{ tags: ["UNUSED"] }] as any)).toEqual({
      hana: {},
      postgres: {},
    });
  });
  it("", () => {
    const serviceCredentials = filterServiceCredentials(
      JSON.stringify(combinedJson),
      serviceNames.DB_SVC
    );
    const filteredEnv = processForComposeDbSvc(
      deepCopy<CombinedEnv>(serviceCredentials)
    );
    expect(dbSvcConverter(filteredEnv)).toEqual({
      hana: dbSvcHanaJson,
      postgres: dbSvcPostgresJson,
    });
  });
});

describe("Conversion from env to VCAP svc format", () => {
  it("", () => {
    expect(vcapSvcConverter(deepCopy<CombinedEnv>(combinedJson))).toEqual(
      envVcapJson
    );
  });
});
