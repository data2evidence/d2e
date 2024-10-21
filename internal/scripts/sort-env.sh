#!/usr/bin/env bash
# sort keys https://mikefarah.gitbook.io/yq/operators/sort-keys#sort-keys-recursively
# sort arrays https://stackoverflow.com/questions/73746627/yq-go-mike-farah-sort-all-arrays-recursively
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
cd $GIT_BASE_DIR
YAML_FILES=($(ls -a .env.*.yml ))
for YAML_FILE in ${YAML_FILES[@]}; do
    echo YAML_FILE=$YAML_FILE
    yq -i -P 'sort_keys(..) | (... | select(type == "!!seq")) |= sort' $YAML_FILE
done