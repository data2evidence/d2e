CREATE SEQUENCE d4l_dd_entity_map_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE d4l_dd_entity_map
(
    id integer NOT NULL DEFAULT nextval('d4l_dd_entity_map_id_seq'::regclass),
    entity_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT d4l_dd_entity_map_pkey PRIMARY KEY (entity_id)
);
