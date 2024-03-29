ALTER TABLE d4l_dd_s4h_entity_map 
ALTER COLUMN "id" TYPE bigint;

ALTER TABLE d4l_dd_s4h_entity_map 
ALTER COLUMN "entity_id" TYPE varchar(250);

ALTER SEQUENCE d4l_dd_s4h_entity_map_id_seq
MAXVALUE 9223372036854775807;