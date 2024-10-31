#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
D2E_RESOURCE_LIMIT=${D2E_RESOURCE_LIMIT:-0.7}
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}
PRIVATE_ONLY=${PRIVATE_ONLY:-false}
TLS_REGENERATE=${TLS_REGENERATE:-false}

# vars
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
DOTENV_FILE_OUT=.env.$ENV_TYPE

# action
cd $GIT_BASE_DIR

# INFO convert env yaml & private env yaml to dotenv
ENV_NAME=$ENV_NAME ENV_TYPE=$ENV_TYPE yarn internal set:env

# INFO generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications
ENV_TYPE=$ENV_TYPE TLS_REGENERATE=$TLS_REGENERATE yarn gen:tls

# INFO generate docker resource limits based on available system resources
ENV_TYPE=$ENV_TYPE D2E_RESOURCE_LIMIT=$D2E_RESOURCE_LIMIT yarn gen:resource-limits

# Ensure newline at end
sed -i '' -e '$a\' $DOTENV_FILE_OUT