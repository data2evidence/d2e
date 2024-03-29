--liquibase formatted sql
--changeset alp:V1.0.0.0.6__create_schema_cleanup_with_table_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- WARNING: THIS STORE PROCEDURE MUST NEVER BE USED IN PRODUCTION!!!!!!!!!
-- This is used to delete a list of schemas for cleaning up purpose in DEV and STAGING DB
-- To use this Store Procedure, pass in the Jira Ticket Number as a string parameter
-- SP Usage Example: CALL "SP::DELETE_SCHEMAS_FROM_TABLE"('SGGREEN-437');
-- DEV_CLEANUP_SCHEMA table was manually created in ALPDEV to track the schemas that were dropped
-- The SP will retrieve a list of schemas to delete from DEV_CLEANUP_SCHEMA, update DELETED wtih 1 if it is has been deleted, and with the time
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::DELETE_SCHEMAS_FROM_TABLE" (
	JIRA_TICKET VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
	DECLARE
		REC RECORD;
	BEGIN
	    FOR REC IN
	       SELECT *
	       FROM "DEV_SCHEMA_CLEANUP"
		   WHERE DELETED != 1
	    LOOP
		  EXECUTE FORMAT('DROP SCHEMA IF EXISTS %s CASCADE', REC.SCHEMA_NAME);
		  EXECUTE FORMAT('UPDATE "DEV_SCHEMA_CLEANUP" 
							SET 
								DELETED = 1,
								DATETIME_DELETED = now(),
								DELETED_BY = ''%s''
							WHERE SCHEMA_NAME = ''%s''',JIRA_TICKET, REC.SCHEMA_NAME
							);
    	END LOOP;
END;
$$;
;

--rollback DROP PROCEDURE "SP::DELETE_SCHEMAS_FROM_TABLE";