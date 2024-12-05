#!/usr/bin/env bash
# generate random dotenv secrets - internal
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

# vars
DOTENV_FILE_OUT=.env.$ENV_TYPE
DOTENV_KEYS_OUT=.env.local.keys
DOTENV_YML_IN=$GIT_BASE_DIR/.env.$ENV_NAME.yml
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

# functions
function count {
	cat $DOTENV_FILE_OUT | grep = | awk -F= '{print $1}' | grep _ | sort -u > $DOTENV_KEYS_OUT
	wc -l $DOTENV_FILE_OUT $DOTENV_KEYS_OUT | sed '$d'
	echo
}

# action
cd $GIT_BASE_DIR

echo ". INFO generate random secrets - public"
ENV_NAME=$ENV_NAME ENV_TYPE=$ENV_TYPE yarn --cwd .. gen:env
echo "" >> $DOTENV_FILE_OUT

echo ". INFO generate random secrets - internal"
source $DOTENV_FILE_OUT
source $GIT_BASE_DIR/scripts/lib.sh

echo ". INFO add non-randomized - internal"
cat $DOTENV_YML_IN | yq -o sh 'with_entries(select(.key|test("CADDY__ALP__PUBLIC_FQDN|GH_TOKEN|GIT_TOKEN__PLUGINS_REPO_READ|HANA__CRT|HANA__HOSTNAME|HANA__TENANT_ADMIN_PASSWORD_PLAIN|HANA__TENANT_READ_PASSWORD_PLAIN")))' >> $DOTENV_FILE_OUT

# sorted
# echo ALP_RELEASE=local >> $DOTENV_FILE_OUT
echo DOCKER__RESTART_POLICY=no >> $DOTENV_FILE_OUT
# echo DOCKER_TAG_NAME=local >> $DOTENV_FILE_OUT

# debug
# cat $DOTENV_YML_IN | yq -o sh 'with_entries(select(.key|test("DB_CREDENTIALS__INTERNAL__|POSTGRES_TENANT_")))' >> $DOTENV_FILE_OUT

# POSTGRES_TENANT_*
echo HANA__TENANT_ADMIN_PASSWORD_SALT=$(random-password 25) >> $DOTENV_FILE_OUT
echo HANA__TENANT_READ_PASSWORD_SALT=$(random-password 25) >> $DOTENV_FILE_OUT
echo POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN=$(random-password 25) >> $DOTENV_FILE_OUT
echo POSTGRES_TENANT_ADMIN_PASSWORD_SALT=$(random-password 22) >> $DOTENV_FILE_OUT
echo POSTGRES_TENANT_READ_PASSWORD_PLAIN=$(random-password 25) >> $DOTENV_FILE_OUT
echo POSTGRES_TENANT_READ_PASSWORD_SALT=$(random-password 22) >> $DOTENV_FILE_OUT

source $DOTENV_FILE_OUT
source $GIT_BASE_DIR/internal/scripts/lib.sh # reads DB_CREDENTIALS__INTERNAL* for public-encrypt function
echo POSTGRES_TENANT_ADMIN_PASSWORD=\'"$(public-encrypt ${POSTGRES_TENANT_ADMIN_PASSWORD_SALT} ${POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN})"\' >> $DOTENV_FILE_OUT
echo POSTGRES_TENANT_READ_PASSWORD=\'"$(public-encrypt ${POSTGRES_TENANT_READ_PASSWORD_SALT} ${POSTGRES_TENANT_READ_PASSWORD_PLAIN})"\' >> $DOTENV_FILE_OUT

echo HANA__TENANT_ADMIN_PASSWORD=\'"$(public-encrypt ${HANA__TENANT_ADMIN_PASSWORD_SALT} ${HANA__TENANT_ADMIN_PASSWORD_PLAIN})"\' >> $DOTENV_FILE_OUT
echo HANA__TENANT_READ_PASSWORD=\'"$(public-encrypt ${HANA__TENANT_READ_PASSWORD_SALT} ${HANA__TENANT_READ_PASSWORD_PLAIN})"\' >> $DOTENV_FILE_OUT

echo SQL_RETURN_ON=true >> $DOTENV_FILE_OUT
# echo TLS__CADDY_DIRECTIVE=\'tls internal\' >> $DOTENV_FILE_OUT

# cat $DOTENV_YML_IN | yq '.DATABASE_CREDENTIALS' | yq '.[1].values.credentials.adminPassword' # test
set -a && source $DOTENV_FILE_OUT && set +a # export vars for envsubst
cat $DOTENV_YML_IN | yq -o sh 'with_entries(select(.key|test("DATABASE_CREDENTIALS")))' | envsubst >> $DOTENV_FILE_OUT

count
echo
