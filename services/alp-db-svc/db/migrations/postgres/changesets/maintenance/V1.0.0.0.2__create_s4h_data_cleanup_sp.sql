--liquibase formatted sql
--changeset alp:V1.0.0.0.2__create_s4h_data_cleanup_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete all Smart4Health data which are processed by nifi via Smart4Health data pipeline
-- To use this Store Procedure, pass in the schema that the data flow has created in as a string parameter
-- SP Usage Example: CALL "SP::DELETE_S4H_DATA_FROM_SCHEMA" ('SCHEMA_1')
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::DELETE_S4H_DATA_FROM_SCHEMA" (
	PARAM_SCHEMA VARCHAR(1000)
)
LANGUAGE plpgsql
AS $$
	BEGIN
		EXECUTE format('DELETE FROM %s."PERSON"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."OBSERVATION"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."CONDITION_OCCURRENCE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."PROCEDURE_OCCURRENCE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."DEVICE_EXPOSURE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."VISIT_OCCURRENCE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."DRUG_EXPOSURE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."GDM.CONSENT"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."GDM.QUESTIONNAIRE_RESPONSE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."OMOP.TRACE"', PARAM_SCHEMA);		
END;
$$;
;

--rollback DROP PROCEDURE "SP::DELETE_S4H_DATA_FROM_SCHEMA";