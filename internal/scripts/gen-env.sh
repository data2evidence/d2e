#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}
PRIVATE_ONLY=${PRIVATE_ONLY:-false}

echo ENV_NAME=$ENV_NAME 
echo ENV_TYPE=$ENV_TYPE

# vars
DOTENV_FILE=$GIT_BASE_DIR/.env.$ENV_TYPE

cd $GIT_BASE_DIR

# functions
function merge-yml () { 
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@} 
}

# build array of dotenv
if [ $PRIVATE_ONLY = true ]; then
    DOTENV_YMLS=(.env.private.yml)
elif [ $ENV_TYPE = local ]; then
    DOTENV_YMLS=(.env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml .env.private.yml)
elif [ $ENV_TYPE = remote ]; then
    DOTENV_YMLS=(.env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml)
fi
for file in ${DOTENV_YMLS[@]}; do touch $file; done

# convert maps & arrays to strings
merge-yml ${DOTENV_YMLS[@]} | yq 'with_entries(select(.value|tag|test("!!map|!!seq"))|.value|=(.|@json))' | sed -e 's/{}//' > .env.tmp.yml

# export vars for envsubst
merge-yml ${DOTENV_YMLS[@]} | yq -o shell > .env.tmp; set -a; source .env.tmp; set +a

# generate DOTENV_FILE
echo "# ${DOTENV_FILE##*/} $ENV_NAME" > $DOTENV_FILE
[ ! -z ${GITHUB_REPOSITORY+x} ] && echo "# https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >> $DOTENV_FILE
merge-yml ${DOTENV_YMLS[@]} .env.tmp.yml | yq -o sh | envsubst >> $DOTENV_FILE
merge-yml ${DOTENV_YMLS[@]} .env.tmp.yml | yq 'keys | .[]' > $DOTENV_FILE.keys

echo "${DOTENV_YMLS[@]} => $(wc -l $DOTENV_FILE)"
rm .env.tmp .env.tmp.yml

$GIT_BASE_DIR/scripts/gen-tls.sh
$GIT_BASE_DIR/scripts/gen-resource-limits.sh