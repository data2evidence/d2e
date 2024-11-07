#!/usr/bin/env bash
# generate internal dotenv file
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

# vars
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
DOTENV_FILE_OUT=.env.$ENV_TYPE

# action
cd $GIT_BASE_DIR
source scripts/lib.sh
source internal/scripts/lib.sh

ENV_NAME=$ENV_NAME ENV_TYPE=$ENV_TYPE scripts/gen-env.sh

source $DOTENV_FILE_OUT

POSTGRES_TENANT_ADMIN_PASSWORD_SALT=$(random-password 22)
POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN=$(random-password 25)
POSTGRES_TENANT_ADMIN_PASSWORD=$(public-encrypt ${POSTGRES_TENANT_ADMIN_PASSWORD_SALT} ${POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN})
echo POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN=$POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN >> $DOTENV_FILE_OUT
