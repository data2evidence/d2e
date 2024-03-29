--liquibase formatted sql
--changeset alp:V5.3.1.3.5_alter_cohort_tables_column.sql

-- Allow null values for COHORT_END_DATE, and change COHORT_START_DATE and COHORT_END_DATE to DATETIME
ALTER TABLE "COHORT" ALTER ("COHORT_END_DATE" DATETIME NULL);
ALTER TABLE "COHORT" ALTER ("COHORT_START_DATE" DATETIME);

-- Create sequence for cohort definition id
CREATE SEQUENCE COHORT_DEFINITION_ID_SEQ
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Add COHORT_MODIFICATION_DATE and OWNER column, allow null values for DEFINITION_TYPE_CONCEPT_ID and SUBJECT_CONCEPT_ID, make COHORT_DEFINITION_ID primary key and auto increment using sequence, make COHORT_MODIFICATION_DATE and COHORT_INITIATION_DATE datetime format
ALTER TABLE "COHORT_DEFINITION" ADD ("COHORT_MODIFICATION_DATE" DATETIME);
ALTER TABLE "COHORT_DEFINITION" ADD ("OWNER" VARCHAR(255) NOT NULL);
ALTER TABLE "COHORT_DEFINITION" ALTER ("COHORT_INITIATION_DATE" DATETIME);
ALTER TABLE "COHORT_DEFINITION" ALTER ("DEFINITION_TYPE_CONCEPT_ID" INTEGER NULL);
ALTER TABLE "COHORT_DEFINITION" ALTER ("SUBJECT_CONCEPT_ID" INTEGER NULL);
ALTER TABLE "COHORT_DEFINITION" ALTER ("COHORT_DEFINITION_ID" INTEGER NOT NULL PRIMARY KEY);