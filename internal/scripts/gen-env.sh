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
DOTENV_FILE_OUT=$GIT_BASE_DIR/.env.$ENV_TYPE

# action
cd $GIT_BASE_DIR

# INFO convert env yaml & private env yaml to dotenv
ENV_NAME=$ENV_NAME ENV_TYPE=$ENV_TYPE internal/scripts/set-env.sh
echo

# INFO generate wildcard certificate `*.alp.local` with Caddy for TLS inter-service communications
ENV_TYPE=$ENV_TYPE TLS_REGENERATE=$TLS_REGENERATE scripts/gen-tls.sh
echo

# INFO generate docker resource limits based on available system resources
ENV_TYPE=$ENV_TYPE D2E_RESOURCE_LIMIT=$D2E_RESOURCE_LIMIT scripts/gen-resource-limits.sh

# INFO Initalize Logto Apps
# yarn -cwd $GIT_BASE_DIR init:logto