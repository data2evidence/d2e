CREATE SEQUENCE d4l_dd_s4h_entry_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE d4l_dd_s4h_entry_with_error_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE TABLE d4l_dd_s4h_entry
(
    id bigint NOT NULL DEFAULT nextval('d4l_dd_s4h_entry_id_seq'::regclass),
    text text NOT NULL,
    resource_id varchar(250) NOT NULL,
    bundle_id bigint NOT NULL,
    bundle_fragments_sequence_number integer NOT NULL,
    bundle_fragments_total_number integer NOT NULL,
    bundle_donated_at timestamp with time zone NOT NULL,
    processed boolean NOT NULL DEFAULT false,
    CONSTRAINT d4l_dd_s4h_entry_pkey PRIMARY KEY (id)
);

CREATE TABLE d4l_dd_s4h_entry_with_error
(
    id integer NOT NULL DEFAULT nextval('d4l_dd_s4h_entry_with_error_id_seq'::regclass),
    text text NOT NULL,
    bundle_id bigint NOT NULL,
    bundle_fragments_sequence_number integer NOT NULL,
    bundle_fragments_total_number integer NOT NULL,
    bundle_donated_at timestamp with time zone NOT NULL,
    error_reason text NOT NULL,
    CONSTRAINT d4l_dd_s4h_entry_with_error_pkey PRIMARY KEY (id)
);