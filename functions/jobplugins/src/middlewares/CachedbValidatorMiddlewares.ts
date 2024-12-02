import { body } from "express-validator";

// Validation rules for ICreateCachedbFileFlowRunDto
export const validateCreateCachedbFileFlowRunDto = () => [
  body("datasetId").isUUID().withMessage("datasetId must be a valid UUID"),
];
