--liquibase formatted sql
--changeset alp:V1.0.0.0.0__create_gdm_data_cleanup_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete all Generic Data Model data which are processed by nifi via Study data pipeline
-- To use this Store Procedure, pass in the schema that the data flow has created in as a string parameter
-- SP Usage Example: CALL "SP::DELETE_GDM_DATA_FROM_SCHEMA" ('SCHEMA_1')
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::DELETE_GDM_DATA_FROM_SCHEMA" (
	PARAM_SCHEMA VARCHAR(1000)
)
LANGUAGE plpgsql
AS $$
	BEGIN
		EXECUTE format('DELETE FROM %s."GDM.QUESTIONNAIRE_RESPONSE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."GDM.QUESTIONNAIRE_RESPONSE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."GDM.QUESTIONNAIRE_RESPONSE"', PARAM_SCHEMA);
END;
$$;

--rollback DROP PROCEDURE "SP::DELETE_GDM_DATA_FROM_SCHEMA";