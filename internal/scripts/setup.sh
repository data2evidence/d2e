#!/usr/bin/env bash  
# initial setup
set -o pipefail
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

# expected OP_VAULT_NAME set e.g. in .zshrc
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1

DRIVERS_DIR=$GIT_BASE_DIR/cache/drivers
op read --out-file $DRIVERS_DIR/alp-dbcli-v1.0.0.tgz "op://${OP_VAULT_NAME}/cache-alp-dbcli-v1.0.0.tgz/alp-dbcli-v1.0.0.tgz" --force
op read --out-file $DRIVERS_DIR/ngdbc-latest.jar "op://${OP_VAULT_NAME}/cache-ngdbc-latest/ngdbc-latest.jar" --force