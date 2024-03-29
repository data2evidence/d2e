CREATE SEQUENCE d4l_dd_s4h_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE d4l_dd_s4h_entity_map_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;


CREATE TABLE d4l_dd_s4h
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_s4h_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT d4l_dd_s4h_pkey PRIMARY KEY (id)
);


CREATE TABLE d4l_dd_s4h_entity_map
(
    id integer NOT NULL DEFAULT nextval('d4l_dd_s4h_entity_map_id_seq'::regclass),
    entity_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT d4l_dd_s4h_entity_map_pkey PRIMARY KEY (entity_id)
);