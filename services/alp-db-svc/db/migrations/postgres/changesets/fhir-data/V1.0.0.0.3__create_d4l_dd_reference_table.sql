-- Used for Grafana Dashboard --
CREATE SEQUENCE d4l_dd_reference_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;


CREATE TABLE d4l_dd_reference
(
    id integer NOT NULL DEFAULT nextval('d4l_dd_reference_id_seq'::regclass),
    alp_id text COLLATE pg_catalog."default",
    donation_id bigint,
    survey_date date,
    survey_datetime timestamp without time zone,
    survey_source_identifier text COLLATE pg_catalog."default",
    survey_version_number text COLLATE pg_catalog."default"
);