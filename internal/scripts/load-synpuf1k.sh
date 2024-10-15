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
unzip -o $ZIP_PATH -d .

CMD=(yarn create-postgres-cdm-schemas alpdev_pg cdmdefault)
echo . INFO CMD ${CMD[@]} ...
cd $GIT_BASE_DIR
# ${CMD[@]}
