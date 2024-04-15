#!/usr/bin/env bash
# Get Athena Vocab from D4L Singapore Google Drive
# GIT_BASE_DIR set by ay alias
set -o nounset
set -o errexit
set -o pipefail

# inputs
[ -z "${GOOGLE_DRIVE_DATA_DIR}" ] && echo "FATAL GOOGLE_DRIVE_DATA_DIR is not set" && exit 1

# vars
CONTAINER_DIR=/vocab
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/vocab
ZIP_DIR=$GIT_BASE_DIR/cache/zip
GOOGLE_DRIVE_BASE_DIR=$(ls -d ~/Library/CloudStorage/GoogleDrive* | head -1)
SRC_DIR="$GOOGLE_DRIVE_BASE_DIR/$GOOGLE_DRIVE_DATA_DIR/Athena_OMOP_Vocabulary"
ls -1 "${SRC_DIR}" | grep zip

# action
echo . clear $CACHE_DIR
cd $CACHE_DIR
rm -fv *
echo . get latest Athena_OMOP_Vocabulary zip
# ls $SRC_DIR
ZIPFILE_PATH=$(find "$SRC_DIR" -depth 1 -name "*.zip" | tail -n 1)
ZIPFILE_NAME="${ZIPFILE_PATH##*/}"
# echo ZIPFILE_PATH=$ZIPFILE_PATH
# echo ZIPFILE_NAME=$ZIPFILE_NAME
cp -v "$ZIPFILE_PATH" $ZIP_DIR
unzip -o $ZIP_DIR/$ZIPFILE_NAME -d . # -n

echo . wc -l
wc -l *.csv | sort -nr

echo . Truncate
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "truncate cdmvocab.concept, cdmvocab.concept_ancestor, cdmvocab.concept_class, cdmvocab.concept_relationship, cdmvocab.concept_synonym, cdmvocab.domain, cdmvocab.drug_strength, cdmvocab.relationship, cdmvocab.vocabulary;" || true

echo . Load tables
for CSV_FILE in *.csv; do 
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