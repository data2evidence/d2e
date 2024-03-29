--liquibase formatted sql
--changeset alp:V1.0.0.0.3__create_schema_cleanup_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete a list of schemas for cleaning up purpose in DEV and STAGING DB
-- To use this Store Procedure, pass in a list of comma seperated schemas as a string parameter
-- SP Usage Example: CALL "SP::DELETE_SCHEMA_AND_AUDIT_POLICY"('SCHEMA_1, SCHEMA_2, SCHEMA_3, AND_SO_ON')
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::DELETE_SCHEMAS" (
	PARAM_SCHEMAS VARCHAR(10000)
)
LANGUAGE plpgsql
AS $$
	DECLARE
		REC RECORD;
	BEGIN
		CREATE TEMP TABLE LIST_OF_SCHEMAS ON COMMIT DROP AS (
			SELECT 
				TRIM(UNNEST(STRING_TO_ARRAY(PARAM_SCHEMAS,','))) AS SCHEMA_NAME
		);

	    FOR REC IN
	       SELECT *
	       FROM LIST_OF_SCHEMAS
	    LOOP
		   EXECUTE FORMAT('DROP SCHEMA IF EXISTS %s CASCADE', REC.SCHEMA_NAME);
    	END LOOP;
END;
$$;
;

--rollback DROP PROCEDURE "SP::DELETE_SCHEMAS";
