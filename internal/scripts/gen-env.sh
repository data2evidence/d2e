#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
GIT_BASE_DIR=${GIT_BASE_DIR:-.}
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}
PRIVATE_ONLY=${PRIVATE_ONLY:-false}

echo ENV_NAME=$ENV_NAME 
echo ENV_TYPE=$ENV_TYPE

# functions
function merge-yml () { 
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@} 
}

# vars
DOTENV_FILE=$GIT_BASE_DIR/.env.$ENV_TYPE

# build array of dotenv
if [ $PRIVATE_ONLY = true ]; then
    ENV_YMLS=(env.private.yml)
elif [ $ENV_TYPE = local ]; then
    ENV_YMLS=(env.base-all.yml env.base-$ENV_TYPE.yml env.$ENV_NAME.yml env.private.yml)
elif [ $ENV_TYPE = remote ]; then
    ENV_YMLS=(env.base-all.yml env.base-$ENV_TYPE.yml env.$ENV_NAME.yml)
fi
DOTENV_YMLS=($(echo ${ENV_YMLS[@]} | sed -e 's/env/.env/g'))
for file in ${ENV_YMLS[@]} ${DOTENV_YMLS[@]}; do touch $file; done

# convert maps & arrays to strings
merge-yml ${ENV_YMLS[@]} ${DOTENV_YMLS[@]} | yq 'with_entries(select(.value|tag|test("!!map|!!seq"))|.value|=(.|@json))' | sed -e 's/{}//' > .env.tmp.yml

# export vars for envsubst
merge-yml ${ENV_YMLS[@]} ${DOTENV_YMLS[@]} | yq -o shell > .env.tmp; set -a; source .env.tmp; set +a

# generate DOTENV_FILE
echo "# ${DOTENV_FILE##*/} $ENV_NAME" > $DOTENV_FILE
[ ! -z ${GITHUB_REPOSITORY+x} ] && echo "# https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >> $DOTENV_FILE
merge-yml ${ENV_YMLS[@]} ${DOTENV_YMLS[@]} .env.tmp.yml | yq -o sh | envsubst >> $DOTENV_FILE
merge-yml ${ENV_YMLS[@]} ${DOTENV_YMLS[@]} .env.tmp.yml | yq 'keys | .[]' > $DOTENV_FILE.keys

echo "${ENV_YMLS[@]} + ${DOTENV_YMLS[@]} => $(wc -l $DOTENV_FILE)"
rm .env.tmp .env.tmp.yml