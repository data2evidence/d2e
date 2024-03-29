import { ALP_STAGING_AREAS } from "./utils/config";
const app = require("./app");
const supertest = require("supertest");

const isNotEmptyArgument = (value: string, name: string): boolean | void => {
  if (value) {
    return true;
  }

  throw `${name} argument is missing!`;
};

const validateDatabaseType = (value: string): string | void => {
  isNotEmptyArgument(value, "DatabaseType");

  if (value.toLowerCase() === "postgres") {
    return value.toLowerCase();
  }

  throw "DatabaseType argument can only be [postgres]!";
};

const validateStagingArea = (value: string): string | void => {
  if ([ALP_STAGING_AREAS.FHIR_DATA].includes(value.toLowerCase() as any)) {
    return value.toLowerCase();
  }

  // TODO
  throw "Datamodel argument can only be [fhir_data]";
};

const main = async () => {
  let response: any;

  const args: string[] = process.argv.slice(2);
  const command: string = args[0] ? args[0] : "";
  const databaseType: string | void = validateDatabaseType(args[1]);
  const tenantDatabase: string = args[2];
  const schema: string = args[3];
  const dataModel: string = args[4] ? args[4] : "fhir_data";
  validateStagingArea(dataModel);

  switch (command.toLowerCase()) {
    // Execution template: npm run cdm-install-script -- {command-arg} {databaseType-arg} {tenantDatabase-arg} {schema-arg} {dataModel-arg}
    // Example command: npm run cdm-install-script -- create_staging_area postgres alp fhir_data fhir_data
    case "create_staging_area":
      console.log("Running create command.....");
      isNotEmptyArgument(tenantDatabase, "TenantDatabase");
      isNotEmptyArgument(schema, "Schema");

      response = await supertest(app).post(
        `/alpdb/${databaseType}/database/${tenantDatabase}/staging-area/${dataModel}/schema/${schema}`
      );
      return response.body;

    default:
      console.log(
        `Command argument is either missing or invalid! Only [create_staging_area] command is supported.`
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
