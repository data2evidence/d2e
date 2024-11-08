#!/usr/bin/env bash
set -o nounset
set -o errexit
echo ${0} ...

# inputs
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

# vars
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

DOTENV_FILE_OUT=.env.$ENV_TYPE
DOTENV_KEYS_OUT=.env.$ENV_NAME.keys
DOTENV_YAML_IN_PRIVATE=.env.$ENV_TYPE.private.yml
DOTENV_YAML_IN=.env.$ENV_NAME.yml

echo ". INFO ${DOTENV_YAML_IN} + ${DOTENV_YAML_IN_PRIVATE} => $DOTENV_FILE_OUT"

# action
cd $GIT_BASE_DIR
[ ! -e $DOTENV_YAML_IN ] && echo FATAL $DOTENV_YAML_IN missing && exit 1
[ ! -e $DOTENV_YAML_IN_PRIVATE ] && touch $DOTENV_YAML_IN_PRIVATE

# export vars for envsubst
yq -o shell $DOTENV_YAML_IN > .env.tmp; set -a; source .env.tmp; set +a
rm .env.tmp

# functions
function merge-yml () {
	# https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

# generate DOTENV_FILE_OUT
echo "# ${DOTENV_FILE_OUT##*/} $ENV_NAME" > $DOTENV_FILE_OUT
[ ! -z ${GITHUB_REPOSITORY+x} ] && echo "# https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >> $DOTENV_FILE_OUT
merge-yml $DOTENV_YAML_IN $DOTENV_YAML_IN_PRIVATE | yq -o sh | envsubst >> $DOTENV_FILE_OUT
cat $DOTENV_YAML_IN | yq 'keys | .[]' | sort > $DOTENV_YAML_IN.keys
cat $DOTENV_YAML_IN_PRIVATE | yq 'keys | .[]' 2> /dev/null | sort > $DOTENV_YAML_IN_PRIVATE.keys
cat $DOTENV_YAML_IN  | yq 'keys | .[]' | sort > $DOTENV_KEYS_OUT
wc -l --total never $DOTENV_YAML_IN.keys $DOTENV_YAML_IN_PRIVATE.keys $DOTENV_KEYS_OUT $DOTENV_FILE_OUT
echo