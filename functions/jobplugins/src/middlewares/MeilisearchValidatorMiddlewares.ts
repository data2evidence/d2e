import { body } from "npm:express-validator";

// Validation rules for MeilisearchAddIndexFlowRunDto
export const validateMeilisearchAddIndexFlowRunDto = () => [
  body("databaseCode").isString().withMessage("databaseCode must be a string"),

  body("vocabSchemaName")
    .isString()
    .withMessage("vocabSchemaName must be a string"),

  body("tableName").isString().withMessage("tableName must be a string"),
];
