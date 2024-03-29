CREATE SEQUENCE d4l_dd_with_decryption_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE d4l_dd_with_error_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE TABLE d4l_dd_with_decryption
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_with_decryption_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    alp_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT d4l_dd_with_decryption_pkey PRIMARY KEY (id)
);


CREATE TABLE d4l_dd_with_error
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_with_error_id_seq'::regclass),
    text text COLLATE pg_catalog."default",
    alp_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    error_reason text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT d4l_dd_with_error_pkey PRIMARY KEY (id)
);