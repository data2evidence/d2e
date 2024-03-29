. ./setup.sh
hdi create-container -X SYSTEM ${SCHEMA}
hdi write -r ${SCHEMA} src/ cfg/ omop/
hdi status ${SCHEMA}

hdi make ${SCHEMA} @ src/ cfg/ omop/
hdi status ${SCHEMA}

hdi grant-container-schema-privilege ${SCHEMA} SELECT SYSTEM
hdi grant-container-schema-privilege ${SCHEMA} EXECUTE SYSTEM
hdi grant-container-schema-privilege ${SCHEMA} "CREATE ANY" SYSTEM

hdi grant-container-schema-privilege ${SCHEMA} INSERT SYSTEM
hdi grant-container-schema-privilege ${SCHEMA} UPDATE SYSTEM
hdi grant-container-schema-privilege ${SCHEMA} DELETE SYSTEM