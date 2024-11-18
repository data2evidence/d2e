#!/usr/bin/env bash
# Seed postgres cdm schemas with SynPUF-1k
# if GOOGLE_DRIVE_DATA_DIR is set then attempt to copy latest zip from google drive
# otherwise use zip from $ZIP_DIR
set -o nounset
set -o errexit
set -o pipefail
echo ${0} ...

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/synpuf1k

# inputs
ZIP_DIR=${ZIP_DIR:-$GIT_BASE_DIR/cache/zip}
ZIP_GLOB=${ZIP_GLOB:-synpuf1k}

if [ -v GOOGLE_DRIVE_DATA_DIR ]; then
	echo GOOGLE_DRIVE_DATA_DIR=$GOOGLE_DRIVE_DATA_DIR
	GOOGLE_DRIVE_BASE_DIR=$(ls -d ~/Library/CloudStorage/GoogleDrive* | head -1)
	SRC_DIR="$GOOGLE_DRIVE_BASE_DIR/$GOOGLE_DRIVE_DATA_DIR/Synpuf1k"; # echo SRC_DIR=$SRC_DIR
	SRC_ZIP_PATH=$(find "$SRC_DIR" -name ${ZIP_GLOB}.zip | tail -n 1); # echo SRC_ZIP_PATH=$SRC_ZIP_PATH
	cp -v "$SRC_ZIP_PATH" $ZIP_DIR
else
	echo ". INFO GOOGLE_DRIVE_DATA_DIR unset"
fi

ZIP_PATH=$(find $ZIP_DIR . -name "${ZIP_GLOB}.zip" | tail -n 1)
if [ ! -f "${ZIP_PATH}" ]; then
	echo . INFO $ZIP_DIR/$ZIP_GLOB not found
	exit 1
fi

# action
echo . INFO unzip $ZIP_PATH ...
cd $CACHE_DIR
CMD=(unzip -oj $ZIP_PATH -d .)
echo . INFO CMD ${CMD[@]} ...
${CMD[@]}

CMD=(yarn create-postgres-cdm-schemas alpdev_pg cdmdefault)
echo . INFO CMD ${CMD[@]} ...
cd $GIT_BASE_DIR
${CMD[@]}

CMD=(docker exec -it alp-dataflow-gen-worker prefect deployment run data_load_plugin/data_load_plugin --param options='{"files":[{"name": "Location","path": "/app/synpuf1k/002_LOCATION.csv", "truncate": "True", "table_name": "location"},{"name": "CARE_SITE","path": "/app/synpuf1k/003_CARE_SITE.csv", "truncate": "True", "table_name": "care_site"},{"name": "Provider","path": "/app/synpuf1k/004_PROVIDER.csv", "truncate": "True", "table_name": "provider"},{"name": "Cost","path": "/app/synpuf1k/005_COST.csv", "truncate": "True", "table_name": "cost"},{"name": "Person","path": "/app/synpuf1k/006_PERSON.csv", "truncate": "True", "table_name": "person"},{"name": "Death","path": "/app/synpuf1k/007_DEATH.csv", "truncate": "True", "table_name": "death"},{"name": "Condition_Occirence","path": "/app/synpuf1k/008_CONDITION_OCCURRENCE.csv", "truncate": "True", "table_name": "condition_occurrence"},{"name": "Condition_Era","path": "/app/synpuf1k/009_CONDITION_ERA.csv", "truncate": "True", "table_name": "condition_era"},{"name": "Device_Exposure","path": "/app/synpuf1k/010_DEVICE_EXPOSURE.csv", "truncate": "True", "table_name": "device_exposure"},{"name": "Drug_Exposure","path": "/app/synpuf1k/011_DRUG_EXPOSURE.csv", "truncate": "True", "table_name": "drug_exposure"},{"name": "Drug_Era","path": "/app/synpuf1k/012_DRUG_ERA.csv", "truncate": "True", "table_name": "drug_era"},{"name": "Measurement","path": "/app/synpuf1k/013_MEASUREMENT.csv", "truncate": "True", "table_name": "measurement"},{"name": "Observation","path": "/app/synpuf1k/014_OBSERVATION.csv", "truncate": "True", "table_name": "observation"},{"name": "Observation_Period","path": "/app/synpuf1k/015_OBSERVATION_PERIOD.csv", "truncate": "True", "table_name": "observation_period"},{"name": "Payer_Plan_Period","path": "/app/synpuf1k/016_PAYER_PLAN_PERIOD.csv", "truncate": "True", "table_name": "payer_plan_period"},{"name": "Procedure_Occurrence","path": "/app/synpuf1k/017_PROCEDURE_OCCURRENCE.csv", "truncate": "True", "table_name": "procedure_occurrence"},{"name": "Visit_Occurrence","path": "/app/synpuf1k/018_VISIT_OCCURRENCE.csv", "truncate": "True", "table_name": "visit_occurrence"}],"schema_name":"cdmdefault","header":"true","delimiter":",","database_code": "alpdev_pg", "chunksize": "50000", "encoding": "utf_8"}')
echo . INFO CMD ${CMD[@]} ...
${CMD[@]}