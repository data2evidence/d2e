import { body } from "npm:express-validator";

// Validation rules for CohortJson
const validateCohortJson = () => [
  body("options.cohortJson.id")
    .isNumeric()
    .withMessage("CohortJson id must be a number"),
  body("options.cohortJson.name")
    .isString()
    .withMessage("CohortJson name must be a string"),
  body("options.cohortJson.createdDate")
    .isNumeric()
    .withMessage("CohortJson createdDate must be a number"),
  body("options.cohortJson.modifiedDate")
    .isNumeric()
    .withMessage("CohortJson modifiedDate must be a number"),
  body("options.cohortJson.hasWriteAccess")
    .isBoolean()
    .withMessage("CohortJson hasWriteAccess must be a boolean"),
  body("options.cohortJson.tags")
    .isArray()
    .withMessage("CohortJson tags must be an array of strings"),
  body("options.cohortJson.expressionType")
    .isObject()
    .withMessage("CohortJson expressionType must be an object"),
];

// Validation rules for CohortGeneratorFlowRunOptions
export const validateCohortGeneratorFlowRunDto = () => [
  body("options.databaseCode")
    .isString()
    .withMessage("databaseCode must be a string"),
  body("options.schemaName")
    .isString()
    .withMessage("schemaName must be a string"),
  body("options.stringvocabSchemaName")
    .isString()
    .withMessage("stringvocabSchemaName must be a string"),
  ...validateCohortJson(), // Include the validation for the nested cohortJson object
  body("options.datasetId")
    .isString()
    .withMessage("datasetId must be a string"),
  body("options.description")
    .isString()
    .withMessage("description must be a string"),
  body("options.owner").isString().withMessage("owner must be a string"),
  body("options.token").isString().withMessage("token must be a string"),
];
