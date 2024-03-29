--liquibase formatted sql
--changeset alp:V1.0.0.0.0__create_gdm_data_cleanup_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete all Generic Data Model data which are processed by nifi via Study data pipeline
-- To use this Store Procedure, pass in the schema that the data flow has created in as a string parameter
-- SP Usage Example: CALL "SP::DELETE_GDM_DATA_FROM_SCHEMA" ('SCHEMA_1')
-------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE "SP::DELETE_GDM_DATA_FROM_SCHEMA" ("PARAM_SCHEMA" VARCHAR(100))
AS
BEGIN
	DECLARE DELETE_FROM_QUESTIONNAIRE_RESPONSE_SQL VARCHAR(500);
    DECLARE DELETE_FROM_RESEARCH_SUBJECT_SQL VARCHAR(500);
	DECLARE DELETE_FROM_CONSENT_SQL VARCHAR(500);

	DELETE_FROM_QUESTIONNAIRE_RESPONSE_SQL =  'DELETE FROM "' || :PARAM_SCHEMA || '"."GDM.QUESTIONNAIRE_RESPONSE"';
	DELETE_FROM_RESEARCH_SUBJECT_SQL =  'DELETE FROM "' || :PARAM_SCHEMA || '"."GDM.RESEARCH_SUBJECT"';
	DELETE_FROM_CONSENT_SQL =  'DELETE FROM "' || :PARAM_SCHEMA || '"."GDM.CONSENT"';

	EXEC DELETE_FROM_QUESTIONNAIRE_RESPONSE_SQL;
	EXEC DELETE_FROM_RESEARCH_SUBJECT_SQL;
	EXEC DELETE_FROM_CONSENT_SQL;
END;

--rollback DROP PROCEDURE "SP::DELETE_GDM_DATA_FROM_SCHEMA";