import { cdwConfig, cdwConfigDuckdb } from "../../seeds/03_Config";
import { writeFileSync } from "fs";
import { mapping as cdwConfigMapping } from "./cdwConfigMapping";
import { mapping as cdwConfigDuckdbMapping } from "./cdwConfigDuckdbMapping";

const updatePatientAttributes = (_attributes: any, mapping) => {
  const attributes = _attributes;
  const keys = Object.keys(attributes);
  keys.forEach((key) => {
    const cohortDefinitionKey = mapping[key];
    if (cohortDefinitionKey) {
      attributes[key].cohortDefinitionKey = cohortDefinitionKey;
    }
  });
  return attributes;
};
const updateInteractions = (_interactions: any, mapping) => {
  const interactions = _interactions;
  const interactionKeys = Object.keys(interactions);

  interactionKeys.forEach((interactionKey) => {
    const interaction = interactions[interactionKey];
    const cohortDefinitionKeys = mapping[interactionKey];
    if (cohortDefinitionKeys?._interaction) {
      interactions[interactionKey].cohortDefinitionKey =
        cohortDefinitionKeys._interaction;
    }

    const { attributes } = interaction;

    Object.keys(attributes).forEach((attrKey) => {
      if (cohortDefinitionKeys?.[attrKey]) {
        interactions[interactionKey].attributes[attrKey].cohortDefinitionKey =
          cohortDefinitionKeys[attrKey];
      }
    });
  });

  return interactions;
};

cdwConfig.patient.attributes = updatePatientAttributes(
  cdwConfig.patient.attributes,
  cdwConfigMapping._basicData
);
cdwConfig.patient.interactions = updateInteractions(
  cdwConfig.patient.interactions,
  cdwConfigMapping
);

cdwConfigDuckdb.patient.attributes = updatePatientAttributes(
  cdwConfigDuckdb.patient.attributes,
  cdwConfigDuckdbMapping._basicData
);
cdwConfigDuckdb.patient.interactions = updateInteractions(
  cdwConfigDuckdb.patient.interactions,
  cdwConfigDuckdbMapping
);

writeFileSync("cdwConfig.json", JSON.stringify(cdwConfig, null, 2));
writeFileSync("cdwConfigDuckdb.json", JSON.stringify(cdwConfigDuckdb, null, 2));
