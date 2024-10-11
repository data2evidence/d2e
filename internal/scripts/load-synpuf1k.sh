#!/usr/bin/env bash
# Seed postgres cdm schemas with SynPUF-1k
# if GOOGLE_DRIVE_DATA_DIR is set then attempt to copy latest from google drive
set -o nounset
set -o errexit
set -o pipefail

echo ${0} ...
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/synpuf1k

if [ -v GOOGLE_DRIVE_DATA_DIR ]; then
	GOOGLE_DRIVE_BASE_DIR=$(ls -d ~/Library/CloudStorage/GoogleDrive* | head -1)
	SRC_DIR="$GOOGLE_DRIVE_BASE_DIR/$GOOGLE_DRIVE_DATA_DIR/Synpuf1k"; # echo SRC_DIR=$SRC_DIR
	SRC_ZIP_PATH=$(find "$SRC_DIR" -name "*.zip" | tail -n 1); # echo SRC_ZIP_PATH=$SRC_ZIP_PATH
else
	echo "INFO GOOGLE_DRIVE_DATA_DIR unset => attempt copy from ~/Downloads ..."
	SRC_ZIP_PATH=~/Downloads/synpuf1k.zip
fi

if [ -f "${SRC_ZIP_PATH}" ]; then
	cp -v "$SRC_ZIP_PATH" $CACHE_DIR
else
	echo . INFO $SRC_ZIP_PATH not found
fi

CACHE_ZIP_PATH=$(find $CACHE_DIR -name "*.zip" | tail -n 1); echo CACHE_ZIP_PATH=$CACHE_ZIP_PATH
if [ -f $CACHE_ZIP_PATH ]; then
	ZIP_NAME="${CACHE_ZIP_PATH##*/}"; echo ZIP_NAME=$ZIP_NAME
	echo . INFO unzip $CACHE_ZIP_PATH with OVERWRITE ...
	cd $CACHE_DIR
	unzip -o $CACHE_DIR/$ZIP_NAME -d .

	CMD=(yarn create-postgres-cdm-schemas alpdev_pg cdmdefault)
	echo . INFO CMD ${CMD[@]} ...
	cd $GIT_BASE_DIR
	${CMD[@]}
else
	echo FATAL zip not found in $CACHE_DIR
fi