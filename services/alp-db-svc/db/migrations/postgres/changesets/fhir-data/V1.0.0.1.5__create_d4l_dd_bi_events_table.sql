CREATE SEQUENCE d4l_dd_bi_events_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE d4l_dd_bi_events
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_bi_events_seq'::regclass),
    text text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    processed boolean NOT NULL DEFAULT false,
    CONSTRAINT d4l_dd_bi_events_pkey PRIMARY KEY (id)
)