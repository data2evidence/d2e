#!/usr/bin/env bash
set -o nounset
set -o errexit

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}
KEYS_EXCLUDE_REGEX=${KEYS_EXCLUDE_REGEX:-TLS__INTERNAL__|LOGTO__ALP|D2E_CPU_LIMIT|D2E_MEMORY_LIMIT} # ignore system specific keys

echo ". INFO Persist keys from .env.${ENV_TYPE} to .env.$ENV_TYPE.private.yml ignoring keys $KEYS_EXCLUDE_REGEX"

# vars
DOTENV_FILE_IN=.env.${ENV_TYPE}
DOTENV_YML_OUT=.env.$ENV_TYPE.private.yml
DOTENV_KEYS_OUT=.env.$ENV_TYPE.private.keys

# action
cd $GIT_BASE_DIR
touch $DOTENV_YML_OUT

# export env-vars for yq to access
set -a; source $DOTENV_FILE_IN; set +a

# wc -l $DOTENV_FILE_IN

KEYS=($(cat $DOTENV_FILE_IN | grep '=' | grep "^[a-zA-Z]" | awk -F\= '{print $1}' | grep "_" | sort -u | grep -Ev "${KEYS_EXCLUDE_REGEX}"))
# KEY=${KEYS[1]}
for KEY in ${KEYS[@]}; do
	# echo . $KEY
	export KEY
	yq -i '.[env(KEY)]=("$"+ strenv(KEY)|envsubst)' $DOTENV_YML_OUT
done

yq -i -P 'sort_keys(..)' $DOTENV_YML_OUT
cat $DOTENV_YML_OUT | yq 'keys | .[]' | sort > $DOTENV_KEYS_OUT
wc -l $DOTENV_YML_OUT $DOTENV_KEYS_OUT | sed '$d'
echo