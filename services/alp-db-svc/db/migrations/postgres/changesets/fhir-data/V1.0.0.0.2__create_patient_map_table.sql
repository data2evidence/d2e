CREATE SEQUENCE patient_map_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE patient_map
(
    id integer NOT NULL DEFAULT nextval('patient_map_id_seq'::regclass),
    alp_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_map_alp_id_key UNIQUE (alp_id)
);