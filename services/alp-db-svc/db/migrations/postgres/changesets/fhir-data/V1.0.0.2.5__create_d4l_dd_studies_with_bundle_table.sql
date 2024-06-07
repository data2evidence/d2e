-- Table: d4l_dd_studies_with_bundle

-- DROP TABLE IF EXISTS d4l_dd_studies_with_bundle;
CREATE SEQUENCE d4l_dd_studies_with_bundle_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS d4l_dd_studies_with_bundle(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_studies_with_bundle_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    processed integer NOT NULL DEFAULT 0,
    error_reason text COLLATE pg_catalog."default",
    CONSTRAINT d4l_dd_studies_with_bundle_pkey PRIMARY KEY (id)
)

-- ALTER TABLE IF EXISTS d4l_dd_studies_with_bundle
--     OWNER to data_ingestion_owner;

-- REVOKE ALL ON TABLE d4l_dd_studies_with_bundle FROM data_ingestion_write_user;

-- GRANT SELECT ON TABLE d4l_dd_studies_with_bundle TO data_ingestion_read_user;

-- GRANT ALL ON TABLE d4l_dd_studies_with_bundle TO data_ingestion_owner WITH GRANT OPTION;

-- GRANT DELETE, INSERT, SELECT, TRUNCATE, UPDATE ON TABLE d4l_dd_studies_with_bundle TO data_ingestion_write_user;