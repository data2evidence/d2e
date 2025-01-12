#!/usr/bin/env bash

script_full_path=$(dirname "$0")
node_modules_path=$script_full_path/../lib/node_modules/@data2evidence/cli/
export CADDY__CONFIG=$node_modules_path/deploy/caddy-config
export ENV_TYPE=${ENV_TYPE:-remote}
export ENVFILE=.env
export GIT_BASE_DIR=.

docker compose --file $node_modules_path/docker-compose.yml --env-file .env up alp-minerva-postgres alp-logto --wait &&
sleep 10 &&
docker compose --file $node_modules_path/docker-compose.yml --env-file .env up alp-logto-post-init