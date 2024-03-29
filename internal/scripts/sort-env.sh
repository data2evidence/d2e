#!/usr/bin/env bash
YAML_FILES=($(ls -a .env.*.yml env.*.yml ))
for YAML_FILE in ${YAML_FILES[@]}; do 
    echo YAML_FILE=$YAML_FILE
    yq -i -P 'sort_keys(.)' $YAML_FILE
done