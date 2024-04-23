#!/usr/bin/env bash
# create 1password item
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1

# vars
DOTENV_FILE=.env.$ENV_NAME.yml

# create if does not exist
op read op://$OP_VAULT_NAME/$DOTENV_FILE/notesPlain || op item template get "Secure Note" | op item create --vault $OP_VAULT_NAME --title $DOTENV_FILE -