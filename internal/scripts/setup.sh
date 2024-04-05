#!/usr/bin/env bash
# initial setup
[ -z "${op_vault_name}" ] && echo 'FATAL ${op_vault_name} is required' && exit 1

TGZ_NAME=alp-dbcli-v1.0.0.tgz
op read --out-file internal/build/${TGZ_NAME} "op://${op_vault_name}/${TGZ_NAME}/${TGZ_NAME}"