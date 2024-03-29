#!/usr/bin/env bash
# create 1password item
set -o nounset
set -o errexit

# inputs
env_base_name=${npm_package_config_env_base_name:-env}
env_name=${env_name:-local}
op_vault_name=$npm_package_config_op_vault_name

# vars
dotenv_file=.$env_base_name.$env_name.yml

# create if does not exist
op read op://$op_vault_name/$dotenv_file/notesPlain || op item template get "Secure Note" | op item create --vault $op_vault_name --title $dotenv_file -