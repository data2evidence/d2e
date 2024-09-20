import combinedJson from "./jsons/combinedJson.json";
import analyticsSvcForCompose from "./jsons/analyticsSvcForCompose.json";
import dbsvcForCompose from "./jsons/dbsvcForCompose.json";
import { CombinedEnv, HanaConfig, PostgresConfig } from "./types";
import {
  processForComposeDbSvc,
  processForComposeAnalytics,
  filterServiceCredentials,
} from "./processForCompose";
import { serviceNames } from "./processForCompose";

const deepCopy = <T>(obj: any) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

describe("Analytics Config Selector", () => {
  it("should only pick those tagged with analytics", () => {
    const serviceCredentials = filterServiceCredentials(
      JSON.stringify(combinedJson),
      serviceNames.ANALYTICS_SVC
    );
    expect(
      processForComposeAnalytics(deepCopy<CombinedEnv>(serviceCredentials))
    ).toEqual(
      analyticsSvcForCompose as unknown as (HanaConfig | PostgresConfig)[]
    );
  });
});

describe("DB SVC Config Selector", () => {
  it("should only pick those tagged with dbsvc", () => {
    const serviceCredentials = filterServiceCredentials(
      JSON.stringify(combinedJson),
      serviceNames.DB_SVC
    );
    expect(
      processForComposeDbSvc(deepCopy<CombinedEnv>(serviceCredentials))
    ).toEqual(dbsvcForCompose as unknown as (HanaConfig | PostgresConfig)[]);
  });
});
