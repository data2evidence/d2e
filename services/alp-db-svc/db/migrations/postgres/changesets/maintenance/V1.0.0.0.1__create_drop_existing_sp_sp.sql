--liquibase formatted sql
--changeset alp:V1.0.0.0.1__create_drop_existing_sp_sp splitStatements:false

CREATE OR REPLACE PROCEDURE "SP::DROP_EXISTING_SP" (
	SP_NAME VARCHAR(250)
)
LANGUAGE plpgsql
AS $$
	BEGIN
        EXECUTE format('DROP PROCEDURE IF EXISTS %s', SP_NAME);
END;
$$;
;

--rollback DROP PROCEDURE "SP::DROP_EXISTING_SP";