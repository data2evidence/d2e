--liquibase formatted sql
--changeset alp:V1.0.0.0.4__create_study_data_cleanup_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete all study data which are processed by nifi via Study data pipeline
-- To use this Store Procedure, pass in the schema that the data flow has created in as a string parameter
-- SP Usage Example: CALL "SP::DELETE_STUDY_DATA_FROM_SCHEMA"('STUDY_SCHEMA_1')
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::DELETE_STUDY_DATA_FROM_SCHEMA" (
	PARAM_SCHEMA VARCHAR(1000)
)
LANGUAGE plpgsql
AS $$
	BEGIN
		EXECUTE format('DELETE FROM %s."GDM.QUESTIONNAIRE_RESPONSE"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."GDM.RESEARCH_SUBJECT"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."OBSERVATION"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."PROVIDER"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."PERSON"', PARAM_SCHEMA);
		EXECUTE format('DELETE FROM %s."OMOP.TRACE"', PARAM_SCHEMA);		
END;
$$;
;


--rollback DROP PROCEDURE "SP::DELETE_STUDY_DATA_FROM_SCHEMA";
