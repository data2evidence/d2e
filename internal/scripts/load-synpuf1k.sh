#!/usr/bin/env bash
# Seed postgres cdm schemas with SynPUF-1k
# GIT_BASE_DIR set by ay alias
set -o nounset
set -o errexit
set -o pipefail

# inputs
[ -z "${GOOGLE_DRIVE_DATA_DIR}" ] && echo "FATAL GOOGLE_DRIVE_DATA_DIR is not set" && exit 1

# vars
CACHE_DIR=$GIT_BASE_DIR/cache/synpuf1k
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
GOOGLE_DRIVE_BASE_DIR=$(ls -d ~/Library/CloudStorage/GoogleDrive* | head -1)
SRC_DIR="$GOOGLE_DRIVE_BASE_DIR/$GOOGLE_DRIVE_DATA_DIR/Synpuf1k"
ls -1 "${SRC_DIR}"

# action
echo . get latest synpuf1k zip
ZIPFILE_PATH=$(find "$SRC_DIR" -name "*.zip" | tail -n 1)
ZIPFILE_NAME="${ZIPFILE_PATH##*/}"
# echo ZIPFILE_PATH=$ZIPFILE_PATH
# echo ZIPFILE_NAME=$ZIPFILE_NAME
cp "$ZIPFILE_PATH" $CACHE_DIR

echo . unzip with OVERWRITE
cd $CACHE_DIR
unzip -o $CACHE_DIR/$ZIPFILE_NAME -d .

echo . seed-postgres-cdm-schemas
cd $GIT_BASE_DIR
yarn seed-postgres-cdm-schemas cdmdefault