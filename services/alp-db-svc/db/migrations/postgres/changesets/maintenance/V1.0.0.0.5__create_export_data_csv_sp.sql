--liquibase formatted sql
--changeset alp:V1.0.0.0.5__create_export_data_csv_sp splitStatements:false

-------------------------------------------------------------------------------------------------
-- Purpose:
-- This is used to export dataset as csv's for each table matching specific patient ids to a path on the PG instance. 
-- SP Usage Example: CALL "SP::EXPORT_DATA_FROM_SCHEMA"('182,1232,1232', 'CDMSYNPUF1K', '/tmp/synpuf1k')
-------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE "SP::EXPORT_DATA_FROM_SCHEMA" (
	PATIENT_IDS VARCHAR(4000), 
	PARAM_SCHEMA VARCHAR(127),
	EXPORT_PATH VARCHAR(2000)
)
LANGUAGE plpgsql
AS $$
	DECLARE
		EXPORT_TABLE_SQL VARCHAR(5000);
		TEMP_EXPORT_TABLE_NAME VARCHAR(1000);
		i INT;
		GENERATED_DATETIME VARCHAR(500);
		OMOP_VIEW_REC RECORD;
		GDM_VIEW_REC RECORD;
	begin
		 -- Creates temp table based on patient ids
		CREATE TEMP TABLE LIST_OF_PATIENTS ON COMMIT DROP AS (
			SELECT 
				TRIM(UNNEST(STRING_TO_ARRAY(PATIENT_IDS,','))) AS PATIENT_ID
		);
		
		 -- Retrieves all OMOP views from information schema for specified schema;
		CREATE TEMP TABLE OBJECT_NAMES_OMOP ON COMMIT DROP AS
			(SELECT 
				table_schema, table_name
				FROM information_schema.views
				WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
				AND table_schema = PARAM_SCHEMA
				AND table_name LIKE 'VIEW::OMOP%'
			);
		
		-- Export each OMOP views to csv with filtered patient id
		FOR OMOP_VIEW_REC IN
	       SELECT *
	       FROM OBJECT_NAMES_OMOP
	    LOOP
		  EXECUTE FORMAT(
		  	'COPY (SELECT * FROM "%s"."%s"
					WHERE patient_id IN (SELECT patient_id FROM LIST_OF_PATIENTS)
					) 
			TO ''%s'' DELIMITER ''|'' CSV HEADER;', PARAM_SCHEMA, OMOP_VIEW_REC, EXPORT_PATH);
		END LOOP;
    
    	-- Retrieves all GDM views from information schema for specified schema;
		CREATE TEMP TABLE OBJECT_NAMES_GDM ON COMMIT DROP AS -- Retrieves all GDM views from information schema for specified schema;
			(SELECT 
				table_schema, table_name
				FROM information_schema.views
				WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
				AND table_schema = PARAM_SCHEMA
				AND table_name LIKE 'VIEW::GDM%'
			);
		
		-- Export each GDM view to csv with filtered patient id
		FOR GDM_VIEW_REC IN
	       SELECT *
	       FROM OBJECT_NAMES_GDM
	    LOOP
		  EXECUTE FORMAT(
		  	'COPY (SELECT * FROM "%s"."%s"
					WHERE patient_id IN (SELECT patient_id FROM LIST_OF_PATIENTS)
					) 
			TO ''%s'' DELIMITER ''|'' CSV HEADER;', PARAM_SCHEMA, GDM_VIEW_REC, EXPORT_PATH);
		END LOOP;
END;
$$;
;




--rollback DROP PROCEDURE "SP::EXPORT_DATA_FROM_SCHEMA";