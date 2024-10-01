import { writeFileSync } from "fs";
import { cdwConfig, cdwConfigDuckdb } from "../../seeds/03_Config";

const getInteractionsFromConfig = (config) => {
  const { interactions } = config.patient;
  const interactionKeys = Object.keys(interactions);

  const values: { [key: string]: { [key: string]: string } } = {};
  interactionKeys.forEach((interactionKey) => {
    const { attributes } = interactions[interactionKey];
    const attrs: { [key: string]: string } = {};
    Object.keys(attributes).forEach((attrKey) => {
      attrs[attrKey] = attributes[attrKey].cohortDefinitionKey || "";
    });
    attrs._interaction = interactions[interactionKey].cohortDefinitionKey || "";
    values[interactionKey] = attrs;
  });
  return values;
};

const getPatientAttributesFromConfig = (config) => {
  const { attributes } = config.patient;
  const keys = Object.keys(attributes);
  const values: { [key: string]: string } = {};
  keys.forEach((key) => {
    values[key] = attributes[key].cohortDefinitionKey || "";
  });
  return values;
};

const cdwConfigAttributes = getInteractionsFromConfig(cdwConfig);
const cdwConfigDuckdbAttributes = getInteractionsFromConfig(cdwConfigDuckdb);

cdwConfigAttributes._basicData = getPatientAttributesFromConfig(cdwConfig);
cdwConfigDuckdbAttributes._basicData =
  getPatientAttributesFromConfig(cdwConfigDuckdb);

writeFileSync(
  "cdwConfigMapping.ts",
  `export const mapping = ${JSON.stringify(cdwConfigAttributes, null, 2)}`
);
writeFileSync(
  "cdwConfigDuckdbMapping.ts",
  `export const mapping = ${JSON.stringify(cdwConfigDuckdbAttributes, null, 2)}`
);

export {};
