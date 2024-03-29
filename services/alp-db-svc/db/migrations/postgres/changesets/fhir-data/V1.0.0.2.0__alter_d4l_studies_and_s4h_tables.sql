ALTER TABLE d4l_dd_with_decryption
ADD COLUMN fhir_validated Boolean NOT NULL DEFAULT FALSE;

ALTER TABLE d4l_dd_with_decryption
ADD COLUMN fhir_validation_output text NULL;


ALTER TABLE d4l_dd_s4h_entry
ADD COLUMN fhir_validated Boolean NOT NULL DEFAULT FALSE;

ALTER TABLE d4l_dd_s4h_entry
ADD COLUMN fhir_validation_output text NULL;
