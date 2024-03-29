const app = require("./app");
const supertest = require("supertest");

const isEmpty = (bodyObj: any | void): boolean => {
  return Object.keys(bodyObj).length === 0;
};

const main = async () => {
  let response: any;
  let createPrefectFlowRun: any;

  const args: string[] = process.argv.slice(2);
  const requestType: string = args[0];
  const requestUrl: string = args[1];
  const requestBody: any | void = args[2] ? args[2] : {};

  switch (requestType.toLowerCase()) {
    case "get":
      // Example command: npm run cdm-install-script -- get /alpdb/postgres/databases
      console.log("Running get command.....");

      if (isEmpty(requestBody)) {
        response = await supertest(app).get(requestUrl);
        return response.body;
      } else {
        response = await supertest(app)
          .get(requestUrl)
          .send(JSON.parse(String(requestBody)));
        return response.body;
      }

    case "post":
      // Example command: npm run cdm-install-script -- post /alpdb/postgres/database/alp/data-model/omop5-4/schema/cdmtestprefect "{\"cleansedSchemaOption\": false}"
      // Example command: npm run cdm-install-script -- post /alpdb/postgres/database/alp/version-info "{\"schemaListFromPortal\": [\"cdmdefault\"]}"

      console.log("Running post command.....");
      if (isEmpty(requestBody)) {
        response = await supertest(app).post(requestUrl);
        return response.body;
      } else {
        response = await supertest(app)
          .post(requestUrl)
          .send(JSON.parse(String(requestBody)));
        const versionInfoResponse = response.body;
        if (versionInfoResponse.function === "Get Version Info") {
          let jsonRequestBody = JSON.parse(requestBody);
          jsonRequestBody["versionInfo"] = versionInfoResponse;
          createPrefectFlowRun = await supertest(app)
            .post("/alpdb/postgres/prefect/flow-run/update-attributes")
            .send(jsonRequestBody);
          return { prefectFlowRun: createPrefectFlowRun.body };
        } else {
          return versionInfoResponse;
        }
      }

    case "put":
      // Example command: npm run cdm-install-script -- put alpdb/postgres/database/alp/data-model/omop5-4?schema=cdmtestupdate
      console.log("Running put command.....");
      if (isEmpty(requestBody)) {
        response = await supertest(app).put(requestUrl);
        return response.body;
      } else {
        response = await supertest(app)
          .put(requestUrl)
          .send(JSON.parse(String(requestBody)));
        return response.body;
      }

    case "delete":
      console.log("Running delete command.....");
      if (isEmpty(requestBody)) {
        response = await supertest(app).delete(requestUrl);
        return response.body;
      } else {
        response = await supertest(app)
          .delete(requestUrl)
          .send(JSON.parse(String(requestBody)));
        return response.body;
      }

    default:
      console.log(
        `Request type is either missing or invalid! Only [get], [post], [put], [delete] are supported.`
      );
  }
};

(async () => {
  try {
    const result = await main();
    console.log(result);
    process.exit();
  } catch (err) {
    console.log(err);
  }
})();
