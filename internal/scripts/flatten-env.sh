#!/usr/bin/env bash
# cache: .env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml => .env.$ENV_NAME.yml
# then generalize & recurive sort .env.$ENV_NAME.yml
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
OVERWRITE=${OVERWRITE:-false}
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

[ $ENV_NAME=local ] && ENV_TYPE=local || ENV_TYPE=remote

# vars
DOTENV_YML_OUT=$GIT_BASE_DIR/.env.$ENV_NAME.yml
DOTENV_KEYS_OUT=$DOTENV_YML_OUT.keys
CACHE_PATH=$GIT_BASE_DIR/cache/op

DOTENV_YMLS_IN=($CACHE_PATH/.env.base-all.yml $CACHE_PATH/.env.base-$ENV_TYPE.yml $CACHE_PATH/.env.$ENV_NAME.yml)

echo ". INFO flatten cache/op:$(echo ${DOTENV_YMLS_IN[@]} | sed -e "s#${CACHE_PATH}/##g") => ${DOTENV_YML_OUT}"

# action
cd $GIT_BASE_DIR
[ $OVERWRITE = false ] && [ -f $DOTENV_YML_OUT ] && echo "INFO DOTENV_YML_OUT:$DOTENV_YML_OUT exists already & env:OVERWRITE is not set" && exit 1

# functions
function merge-yml () {
    # https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

# action - merge relevant cache env yml to flat yml in git_dir
cd $CACHE_PATH
for file in ${DOTENV_YMLS_IN[@]}; do touch $file; done
echo "# ${DOTENV_YML_OUT##*/}" > $DOTENV_YML_OUT
merge-yml ${DOTENV_YMLS_IN[@]} | sed '/^# .env/ d' >> $DOTENV_YML_OUT

# echo . INFO generalize DATABASE_CREDENTIALS to reference env-var
export JSON_FILE=private-DATABASE_CREDENTIALS.json
cat $DOTENV_YML_OUT | yq .DATABASE_CREDENTIALS > $JSON_FILE
yq -i '.[0].values.credentials.adminPassword="${HANA__TENANT_ADMIN_PASSWORD}"' $JSON_FILE
yq -i '.[0].values.credentials.adminPasswordSalt="${HANA__TENANT_ADMIN_PASSWORD_SALT}"' $JSON_FILE
yq -i '.[0].values.credentials.readPassword="${HANA__TENANT_READ_PASSWORD}"' $JSON_FILE
yq -i '.[0].values.credentials.readPasswordSalt="${HANA__TENANT_READ_PASSWORD_SALT}"' $JSON_FILE

yq -i '.[1].values.credentials.adminPassword="${POSTGRES_TENANT_ADMIN_PASSWORD}"' $JSON_FILE
yq -i '.[1].values.credentials.adminPasswordSalt="${POSTGRES_TENANT_ADMIN_PASSWORD_SALT}"' $JSON_FILE
yq -i '.[1].values.credentials.readPassword="${POSTGRES_TENANT_READ_PASSWORD}"' $JSON_FILE
yq -i '.[1].values.credentials.readPasswordSalt="${POSTGRES_TENANT_READ_PASSWORD_SALT}"' $JSON_FILE

yq -i '.[2].values.credentials.adminPassword="${HANA__TENANT_ADMIN_PASSWORD}"' $JSON_FILE
yq -i '.[2].values.credentials.adminPasswordSalt="${HANA__TENANT_ADMIN_PASSWORD_SALT}"' $JSON_FILE
yq -i '.[2].values.credentials.readPassword="${HANA__TENANT_READ_PASSWORD}"' $JSON_FILE
yq -i '.[2].values.credentials.readPasswordSalt="${HANA__TENANT_READ_PASSWORD_SALT}"' $JSON_FILE

yq -i --output-format json 'sort_keys(..) | (... | select(type == "!!seq")) |= sort' $JSON_FILE # sort
yq -i '.DATABASE_CREDENTIALS = loadstr(env(JSON_FILE))' $DOTENV_YML_OUT # insert

# yq -i 'del(.DICOM__HEALTH_CHECK_PASSWORD)' $DOTENV_YML_OUT
# yq -i 'del(.DB_CREDENTIALS__INTERNAL__PRIVATE_KEY)' $DOTENV_YML_OUT

# finalize
cat $DOTENV_YML_OUT | yq 'keys | .[]' | sort > $DOTENV_KEYS_OUT
wc -l $DOTENV_YML_OUT $DOTENV_KEYS_OUT | sed '$d'
echo