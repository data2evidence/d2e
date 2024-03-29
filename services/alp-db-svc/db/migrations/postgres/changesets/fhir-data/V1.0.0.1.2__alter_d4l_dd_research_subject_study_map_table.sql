ALTER TABLE "d4l_dd_research_subject_study_map" 
RENAME COLUMN id TO person_id;

ALTER TABLE "d4l_dd_research_subject_study_map"
RENAME TO d4l_dd_alp_id_metadata;

ALTER SEQUENCE "d4l_dd_research_subject_study_map_id_seq"
RENAME TO d4l_dd_alp_id_metadata_person_id_seq;