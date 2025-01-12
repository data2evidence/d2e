#!/usr/bin/env bash
script_full_path=$(dirname "$0")
node_modules_path=$script_full_path/../lib/node_modules/@data2evidence/cli/

ENV_EXAMPLE=$node_modules_path/env.example

ENV_TYPE=${ENV_TYPE:-remote} $node_modules_path/scripts/gen-dotenv.sh && $node_modules_path/scripts/gen-tls.sh && $node_modules_path/scripts/gen-resource-limits.sh