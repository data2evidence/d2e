#!/usr/bin/env bash
# generate env.example & README-vars.md
set -o nounset
set -o errexit

# vars
SCRIPTS_DIR=$(dirname $0)
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
README_FILE=$GIT_BASE_DIR/env-vars.md
DOC_YML=$GIT_BASE_DIR/.env.doc.yml

# clear
[ -e $README_FILE ] && rm $README_FILE

# generate README file
echo -e "\n${README_FILE}\n---"
echo "# Environment Variables" | tee $README_FILE
echo "key | type | comment " | tee -a $README_FILE
echo "--- | --- | --- " | tee -a $README_FILE
cat $DOC_YML | yq 'to_entries | .[] | select(.value.readme != "false") | .key + " | " + .value.type  + " | " + (.value.comment // "") ' | tee -a $README_FILE
echo -e "\n"