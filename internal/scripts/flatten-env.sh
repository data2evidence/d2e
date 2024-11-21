#!/usr/bin/env bash
# cache: .env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml => .env.$ENV_NAME.yml
# then generalize & recurive sort .env.$ENV_NAME.yml
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}
OVERWRITE=${OVERWRITE:-false}
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

[ $ENV_TYPE != local ] && [ $ENV_TYPE != remote ] && echo FATAL: ENV_TYPE=local|remote && exit 1

# vars
DOTENV_YML_OUT=$GIT_BASE_DIR/.env.$ENV_NAME.yml
DOTENV_KEYS_OUT=$DOTENV_YML_OUT.keys
CACHE_DIR=$GIT_BASE_DIR/cache/op
export DATABASE_CREDENTIALS_JSON_FILE=private-DATABASE_CREDENTIALS.json

DOTENV_YMLS_IN=($CACHE_DIR/.env.base-all.yml $CACHE_DIR/.env.base-$ENV_TYPE.yml $CACHE_DIR/.env.$ENV_NAME.yml)

echo ". INFO flatten cache/op:$(echo ${DOTENV_YMLS_IN[@]} | sed -e "s#${CACHE_DIR}/##g") => ${DOTENV_YML_OUT}"

# action
cd $GIT_BASE_DIR
[ $OVERWRITE = false ] && [ -f $DOTENV_YML_OUT ] && echo "INFO DOTENV_YML_OUT:$DOTENV_YML_OUT exists already & env:OVERWRITE is not set" && exit 1

# functions
function merge-yml () {
    # https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

# action - merge relevant cache env yml to flat yml in git_dir
for file in ${DOTENV_YMLS_IN[@]}; do touch $file; done
echo "# ${DOTENV_YML_OUT##*/}" > $DOTENV_YML_OUT
merge-yml ${DOTENV_YMLS_IN[@]} | sed '/^# .env/ d' >> $DOTENV_YML_OUT

# decrypt HANA__TENANT_ADMIN_PASSWORD & HANA__TENANT_READ_PASSWORD for later encryption with random dbcreds
DOTENV_TMP=.env.tmp
cat $DOTENV_YML_OUT | yq -o sh > $DOTENV_TMP
source $DOTENV_TMP
DOTENV_FILE_OUT=$DOTENV_TMP
source $GIT_BASE_DIR/internal/scripts/lib.sh

if [ -v HANA__TENANT_ADMIN_PASSWORD_SALT ] && [ -v HANA__TENANT_ADMIN_PASSWORD ]; then
    HANA__TENANT_ADMIN_PASSWORD_PLAIN=$(private-decrypt $HANA__TENANT_ADMIN_PASSWORD_SALT $HANA__TENANT_ADMIN_PASSWORD) yq -i '.HANA__TENANT_ADMIN_PASSWORD_PLAIN=env(HANA__TENANT_ADMIN_PASSWORD_PLAIN)' $DOTENV_YML_OUT
fi
if [ -v HANA__TENANT_READ_PASSWORD_SALT ] && [ -v HANA__TENANT_READ_PASSWORD ]; then
    HANA__TENANT_READ_PASSWORD_PLAIN=$(private-decrypt $HANA__TENANT_READ_PASSWORD_SALT $HANA__TENANT_READ_PASSWORD) yq -i '.HANA__TENANT_READ_PASSWORD_PLAIN=env(HANA__TENANT_READ_PASSWORD_PLAIN)' $DOTENV_YML_OUT
fi

# echo . INFO generalize DATABASE_CREDENTIALS to reference env-var
DATABASE_CREDENTIALS="$(cat $DOTENV_YML_OUT | yq .DATABASE_CREDENTIALS)"

if [ "${DATABASE_CREDENTIALS}" = null ] || [ "${DATABASE_CREDENTIALS}" = '[]' ]; then
    echo "INFO DATABASE_CREDENTIALS empty"
    sed -i.bak "/DATABASE_CREDENTIALS/ s/\[\]/'\[\]'/" $DOTENV_YML_OUT
else
    echo "INFO DATABASE_CREDENTIALS generalize"
    echo $DATABASE_CREDENTIALS > $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[0].values.credentials.adminPassword="${HANA__TENANT_ADMIN_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[0].values.credentials.adminPasswordSalt="${HANA__TENANT_ADMIN_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[0].values.credentials.readPassword="${HANA__TENANT_READ_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[0].values.credentials.readPasswordSalt="${HANA__TENANT_READ_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE

    yq -i '.[1].values.credentials.adminPassword="${POSTGRES_TENANT_ADMIN_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[1].values.credentials.adminPasswordSalt="${POSTGRES_TENANT_ADMIN_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[1].values.credentials.readPassword="${POSTGRES_TENANT_READ_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[1].values.credentials.readPasswordSalt="${POSTGRES_TENANT_READ_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE

    yq -i '.[2].values.credentials.adminPassword="${HANA__TENANT_ADMIN_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[2].values.credentials.adminPasswordSalt="${HANA__TENANT_ADMIN_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[2].values.credentials.readPassword="${HANA__TENANT_READ_PASSWORD}"' $DATABASE_CREDENTIALS_JSON_FILE
    yq -i '.[2].values.credentials.readPasswordSalt="${HANA__TENANT_READ_PASSWORD_SALT}"' $DATABASE_CREDENTIALS_JSON_FILE

    yq -i --output-format json 'sort_keys(..) | (... | select(type == "!!seq")) |= sort' $DATABASE_CREDENTIALS_JSON_FILE # sort
    yq -i '.DATABASE_CREDENTIALS = loadstr(env(DATABASE_CREDENTIALS_JSON_FILE))' $DOTENV_YML_OUT # insert
fi

# finalize
yq -i 'sort_keys(..) | (... | select(type == "!!seq")) |= sort' $DOTENV_YML_OUT
cat $DOTENV_YML_OUT | yq 'keys | .[]' | sort > $DOTENV_KEYS_OUT
wc -l $DOTENV_YML_OUT $DOTENV_KEYS_OUT | sed '$d'
echo