INSERT INTO ${DESTINATION_SCHEMA}.CONCEPT (SELECT * FROM ${SOURCE_SCHEMA}.CONCEPT WHERE valid_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.radiology_image (SELECT * FROM ${SOURCE_SCHEMA}.radiology_image);

INSERT INTO ${DESTINATION_SCHEMA}.radiology_occurrence (SELECT * FROM ${SOURCE_SCHEMA}.radiology_occurrence);

-- vocabulary?

INSERT INTO ${DESTINATION_SCHEMA}.domain (SELECT * FROM ${SOURCE_SCHEMA}.domain);

INSERT INTO ${DESTINATION_SCHEMA}.concept_class (SELECT * FROM ${SOURCE_SCHEMA}.concept_class);

INSERT INTO ${DESTINATION_SCHEMA}.concept_relationship (SELECT * FROM ${SOURCE_SCHEMA}.concept_relationship WHERE valid_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.relationship (SELECT * FROM ${SOURCE_SCHEMA}.relationship);

INSERT INTO ${DESTINATION_SCHEMA}.concept_synonym (SELECT * FROM ${SOURCE_SCHEMA}.concept_synonym);

INSERT INTO ${DESTINATION_SCHEMA}.concept_ancestor (SELECT * FROM ${SOURCE_SCHEMA}.concept_ancestor);

INSERT INTO ${DESTINATION_SCHEMA}.source_to_concept_map (SELECT * FROM ${SOURCE_SCHEMA}.source_to_concept_map WHERE valid_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.drug_strength (SELECT * FROM ${SOURCE_SCHEMA}.drug_strength WHERE valid_start_date <= '${TIMESTAMP}');

-- cohort_initiation_date
INSERT INTO ${DESTINATION_SCHEMA}.cohort_definition (SELECT * FROM ${SOURCE_SCHEMA}.cohort_definition);

INSERT INTO ${DESTINATION_SCHEMA}.attribute_definition (SELECT * FROM ${SOURCE_SCHEMA}.attribute_definition);

-- cdm_source

INSERT INTO ${DESTINATION_SCHEMA}.person (SELECT * FROM ${SOURCE_SCHEMA}.person);

INSERT INTO ${DESTINATION_SCHEMA}.observation_period (SELECT * FROM ${SOURCE_SCHEMA}.observation_period WHERE observation_period_start_date <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.specimen (SELECT * FROM ${SOURCE_SCHEMA}.specimen WHERE specimen_date <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.death (SELECT * FROM ${SOURCE_SCHEMA}.death WHERE death_date <= '${TIMESTAMP}'); 

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.visit_occurrence (SELECT * FROM ${SOURCE_SCHEMA}.visit_occurrence WHERE visit_start_date <= '${TIMESTAMP}'); 

INSERT INTO ${DESTINATION_SCHEMA}.procedure_occurrence (SELECT * FROM ${SOURCE_SCHEMA}.procedure_occurrence WHERE procedure_datetime <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.drug_exposure (SELECT * FROM ${SOURCE_SCHEMA}.drug_exposure WHERE drug_exposure_start_datetime <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.device_exposure (SELECT * FROM ${SOURCE_SCHEMA}.device_exposure WHERE device_exposure_start_datetime <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.condition_occurrence (SELECT * FROM ${SOURCE_SCHEMA}.condition_occurrence WHERE condition_start_datetime <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.measurement (SELECT * FROM ${SOURCE_SCHEMA}.measurement WHERE measurement_date <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.note (SELECT * FROM ${SOURCE_SCHEMA}.note WHERE note_date <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.note_nlp (SELECT * FROM ${SOURCE_SCHEMA}.note_nlp WHERE nlp_date <= '${TIMESTAMP}');

-- NULL is possible in datetime 
INSERT INTO ${DESTINATION_SCHEMA}.observation (SELECT * FROM ${SOURCE_SCHEMA}.observation WHERE observation_date <= '${TIMESTAMP}');
 
INSERT INTO ${DESTINATION_SCHEMA}.fact_relationship (SELECT * FROM ${SOURCE_SCHEMA}.fact_relationship);

-- NOT Required: location

INSERT INTO ${DESTINATION_SCHEMA}.care_site (SELECT * FROM ${SOURCE_SCHEMA}.care_site);

INSERT INTO ${DESTINATION_SCHEMA}.provider (SELECT * FROM ${SOURCE_SCHEMA}.provider);

INSERT INTO ${DESTINATION_SCHEMA}.payer_plan_period (SELECT * FROM ${SOURCE_SCHEMA}.payer_plan_period WHERE payer_plan_period_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.cost (SELECT * FROM ${SOURCE_SCHEMA}.cost);

INSERT INTO ${DESTINATION_SCHEMA}.cohort (SELECT * FROM ${SOURCE_SCHEMA}.cohort WHERE cohort_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.cohort_attribute (SELECT * FROM ${SOURCE_SCHEMA}.cohort_attribute WHERE cohort_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.drug_era (SELECT * FROM ${SOURCE_SCHEMA}.drug_era WHERE drug_era_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.dose_era (SELECT * FROM ${SOURCE_SCHEMA}.dose_era WHERE dose_era_start_date <= '${TIMESTAMP}');

INSERT INTO ${DESTINATION_SCHEMA}.condition_era (SELECT * FROM ${SOURCE_SCHEMA}.condition_era WHERE condition_era_start_date <= '${TIMESTAMP}');