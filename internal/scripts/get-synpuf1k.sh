#!/usr/bin/env bash
# get synpuf1k
set -o pipefail

# inputs
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required => set e.g. in .zshrc' && exit 1

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache

# action
op read --out-file $CACHE_DIR/synpuf1k.zip "env://${OP_VAULT_NAME}/cache-synpuf1k.zip/synpuf1k.zip" --force
unzip $CACHE_DIR/synpuf1k.zip -d $CACHE_DIR