#!/usr/bin/env zsh
# convert .env.pivot*.yml to json

# vars
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

# action
cd $GIT_BASE_DIR
DIR=private-json
mkdir -p $DIR

YAML_FILES=($(ls -a .env.pivot*.yml | sort -r ))
# YAML_FILE=$YAML_FILES[1]
for YAML_FILE in ${YAML_FILES[@]}; do
	JSON_FILE=$DIR/${YAML_FILE:r:s/./}.json
    echo "$YAML_FILE > $JSON_FILE"
    yq -o json $YAML_FILE > $JSON_FILE
done