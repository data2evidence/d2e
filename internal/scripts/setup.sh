#!/usr/bin/env bash
# initial setup
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1

op read --out-file internal/build/alp-dbcli-private-v1.0.0.tgz "op://${op_vault_name}/alp-dbcli-v1.0.0.tgz/alp-dbcli-v1.0.0.tgz"