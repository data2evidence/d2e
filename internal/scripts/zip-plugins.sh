#!/usr/bin/env bash
set -o nounset
set -o errexit
echo ${0} ...
echo INFO zip plugins

GIT_BASE_DIR="$(git rev-parse --show-toplevel)"

# inputs
PLUGINS_DIR=${PLUGINS_DIR:-$GIT_BASE_DIR/../d2e-plugins}
ZIPFILE_DIR=${ZIPFILE_DIR:-$GIT_BASE_DIR/cache/plugins}

# action
cd $PLUGINS_DIR/flows
GIT_BRANCH_NAME=$(git symbolic-ref --short HEAD 2> /dev/null)
echo GIT_BRANCH_NAME=$GIT_BRANCH_NAME

BASE_DIR=$PWD
rm $ZIPFILE_DIR/*.zip
for PLUGIN_PACKAGE_NAME in $(find "$BASE_DIR" -mindepth 1 -maxdepth 1 -type d ! -name ".*" -exec basename {} \;); do
  cd $BASE_DIR/$PLUGIN_PACKAGE_NAME
  ZIPFILE=$ZIPFILE_DIR/$PLUGIN_PACKAGE_NAME.zip
  if [ -e "$ZIPFILE" ]; then
    rm $ZIPFILE
  fi
  zip -q -r $ZIPFILE . -x ".git*" -x "*/.*"
done
cd $ZIPFILE_DIR
du --summarize --human-readable  *
echo $ZIPFILE_DIR
cd $BASE_DIR