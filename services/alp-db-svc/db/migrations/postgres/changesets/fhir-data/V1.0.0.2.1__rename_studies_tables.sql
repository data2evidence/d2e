ALTER TABLE d4l_dd_with_decryption
RENAME TO d4l_dd_studies;

ALTER SEQUENCE d4l_dd_with_decryption_id_seq
RENAME TO d4l_dd_studies_id_seq;


ALTER TABLE d4l_dd_with_error
RENAME TO d4l_dd_studies_with_error;

ALTER SEQUENCE d4l_dd_with_error_id_seq
RENAME TO d4l_dd_studies_with_error_id_seq;


ALTER TABLE d4l_dd_alp_id_metadata
RENAME TO d4l_dd_studies_alp_id_metadata;

ALTER SEQUENCE d4l_dd_alp_id_metadata_person_id_seq
RENAME TO d4l_dd_studies_alp_id_metadata_person_id_seq;


ALTER TABLE d4l_dd_entity_map
RENAME TO d4l_dd_studies_entity_map;

ALTER SEQUENCE d4l_dd_entity_map_id_seq
RENAME TO d4l_dd_studies_entity_map_id_seq;


ALTER TABLE d4l_dd_bi_events
RENAME TO d4l_dd_studies_bi_events;

ALTER SEQUENCE d4l_dd_bi_events_seq
RENAME TO d4l_dd_studies_bi_events_seq;
