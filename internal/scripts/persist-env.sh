#!/usr/bin/env bash
set -o nounset
set -o errexit
echo . 'INFO Persist env from dotenv file to .env.$ENV_TYPE.private.yml'

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

DOTENV_YML_OUT=.env.$ENV_TYPE.private.yml
DOTENV_FILE_IN=.env.${ENV_TYPE}

# action
cd $GIT_BASE_DIR
touch $DOTENV_YML_OUT

# export env-vars for yq to access
set -a; source $DOTENV_FILE_IN; set +a

echo . INFO update $DOTENV_YML_OUT ...
wc -l $DOTENV_FILE_IN

KEYS=($(cat $DOTENV_FILE_IN | grep '=' | grep "^[a-zA-Z]" | awk -F\= '{print $1}' | grep "_" | sort -u))
# KEY=${KEYS[1]}
for KEY in ${KEYS[@]}; do
	echo . $KEY
	export KEY
	yq -i '.[env(KEY)]=("$"+ strenv(KEY)|envsubst)' $DOTENV_YML_OUT
done
wc -l $DOTENV_YML_OUT