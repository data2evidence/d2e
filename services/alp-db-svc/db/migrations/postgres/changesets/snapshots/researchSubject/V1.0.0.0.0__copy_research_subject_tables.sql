-- WHERE ETL_STARTED_AT < seconddate(unseconddate(${DATE_VALUE}))
INSERT INTO ${DESTINATION_SCHEMA}."GDM.RESEARCH_SUBJECT" (SELECT * FROM ${SOURCE_SCHEMA}."GDM.RESEARCH_SUBJECT");