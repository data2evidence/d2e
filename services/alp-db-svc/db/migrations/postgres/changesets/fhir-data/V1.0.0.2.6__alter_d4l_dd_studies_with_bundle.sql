ALTER TABLE d4l_dd_studies_with_bundle
ADD COLUMN fhir_validated Boolean NOT NULL DEFAULT FALSE;

ALTER TABLE d4l_dd_studies_with_bundle
ADD COLUMN fhir_validation_output text NULL;

ALTER TABLE d4l_dd_studies_with_bundle
ADD COLUMN is_bundle_valid Boolean NOT NULL DEFAULT FALSE;
