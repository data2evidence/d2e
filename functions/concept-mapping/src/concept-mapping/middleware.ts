import { query } from "express-validator";

export const ConceptMappingDto = () => [
  query("datasetId")
    .isUUID()
    .notEmpty()
    .withMessage("datasetId is required and must be a valid UUID"),
  query("dialect")
    .isString()
    .notEmpty()
    .withMessage("dialect is required and must be a valid string"),
];
