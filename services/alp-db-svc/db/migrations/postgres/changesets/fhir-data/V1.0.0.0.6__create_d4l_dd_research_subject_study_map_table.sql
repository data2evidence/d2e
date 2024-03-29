CREATE SEQUENCE d4l_dd_research_subject_study_map_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE d4l_dd_research_subject_study_map
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_research_subject_study_map_id_seq'::regclass),
    alp_id text COLLATE pg_catalog."default" NOT NULL,
    study_identifier_value text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT d4l_dd_research_subject_study_map_alp_id_key UNIQUE (alp_id)
);
