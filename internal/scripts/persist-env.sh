#!/usr/bin/env bash
# persist select env from dotenv file
set -o nounset
set -o errexit

# static
REGEX="^LOGTO__ALP"

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

DOTENV_YML_OUT=.env.$ENV_TYPE.private.yml
DOTENV_FILE_IN=.env.${ENV_TYPE}

cd $GIT_BASE_DIR
pwd
touch $DOTENV_YML_OUT

# action
# export env-vars for yq to access
set -a; source $DOTENV_FILE_IN; set +a

echo . INFO updating $DOTENV_YML_OUT ...
wc -l $DOTENV_FILE_IN

KEYS=($(cat $DOTENV_FILE_IN | grep '=' | grep -E "${REGEX}"  | awk -F\= '{print $1}'))
# KEY=${KEYS[1]}
for KEY in ${KEYS[@]}; do
	echo . $KEY
	export KEY
	yq -i '.[env(KEY)]=("$"+ strenv(KEY)|envsubst)' $DOTENV_YML_OUT
done
wc -l $DOTENV_YML_OUT