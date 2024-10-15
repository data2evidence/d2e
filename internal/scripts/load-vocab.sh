#!/usr/bin/env bash
# Load Athena Vocab
# if GOOGLE_DRIVE_DATA_DIR is set then attempt to copy latest zip from google drive
# otherwise use zip from $ZIP_DIR
set -o nounset
set -o errexit
set -o pipefail
echo ${0} ...

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/vocab
CONTAINER_DIR=/vocab

# inputs
ZIP_DIR=${ZIP_DIR:-$GIT_BASE_DIR/cache/zip}
ZIP_GLOB=${ZIP_GLOB:-*vocab*}

if [ -v GOOGLE_DRIVE_DATA_DIR ]; then
	echo GOOGLE_DRIVE_DATA_DIR=$GOOGLE_DRIVE_DATA_DIR
	GOOGLE_DRIVE_BASE_DIR=$(ls -d ~/Library/CloudStorage/GoogleDrive* | head -1)
	SRC_DIR="$GOOGLE_DRIVE_BASE_DIR/$GOOGLE_DRIVE_DATA_DIR/Athena_OMOP_Vocabulary"; # echo SRC_DIR=$SRC_DIR
	SRC_ZIP_PATH=$(find "$SRC_DIR" -name ${ZIP_GLOB}.zip | tail -n 1); # echo SRC_ZIP_PATH=$SRC_ZIP_PATH
	cp -v "$SRC_ZIP_PATH" $ZIP_DIR
else
	echo ". INFO GOOGLE_DRIVE_DATA_DIR unset"
fi

ZIP_PATH=$(find $ZIP_DIR -name "${ZIP_GLOB}.zip" | tail -n 1)
if [ ! -f "${ZIP_PATH}" ]; then
	echo . INFO $ZIP_DIR/$ZIP_GLOB not found
	exit 1
fi

# action
cd $CACHE_DIR
echo . INFO unzip $ZIP_PATH ...
unzip -o $ZIP_PATH -d .

echo . wc -l
wc -l *.csv | sort -nr

echo . Truncate
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "truncate cdmvocab.concept, cdmvocab.concept_ancestor, cdmvocab.concept_class, cdmvocab.concept_relationship, cdmvocab.concept_synonym, cdmvocab.domain, cdmvocab.drug_strength, cdmvocab.relationship, cdmvocab.vocabulary;" || true

echo . Load tables
CSV_FILES=($(ls *.csv))
CSV_FILE=${CSV_FILES[1]}
for CSV_FILE in ${CSV_FILES[@]}; do
	echo load $CSV_FILE ...;
	TABLE_NAME=${CSV_FILE/.csv/}
	if [ "$CSV_FILE" = "DRUG_STRENGTH.csv" ]; then
		docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "\\copy cdmvocab.${TABLE_NAME} FROM '$CONTAINER_DIR/${CSV_FILE}' WITH (FORMAT CSV, HEADER, DELIMITER E'\t', FORCE_NULL (amount_value, amount_unit_concept_id, denominator_value, box_size, numerator_value, numerator_unit_concept_id, denominator_unit_concept_id), ENCODING 'UTF8', QUOTE '\"', ESCAPE E'\\\\');"
	else
		docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "\\copy cdmvocab.${TABLE_NAME} FROM '$CONTAINER_DIR/${CSV_FILE}' WITH (FORMAT CSV, HEADER, DELIMITER E'\t', ENCODING 'UTF8', QUOTE '\"', ESCAPE E'\\\\');";
	fi
done

echo . Validation
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "SELECT table_name, row_count FROM (SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_relationship UNION SELECT 'concept_ancestor' AS table_name, count(*) AS row_count FROM cdmvocab.concept_ancestor UNION SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept UNION SELECT 'relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.relationship UNION SELECT 'concept_synonym' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_synonym UNION SELECT 'vocabulary' AS table_name, COUNT(*) AS row_count FROM cdmvocab.vocabulary UNION SELECT 'domain' AS table_name, COUNT(*) AS row_count FROM cdmvocab.domain UNION SELECT 'drug_strength' AS table_name, COUNT(*) AS row_count FROM cdmvocab.drug_strength UNION SELECT 'concept_class' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_class) temp ORDER BY row_count DESC;"