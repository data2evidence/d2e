#!/usr/bin/env bash
# generate dotenv file with passwords, certificates,
# set -o nounset
# set -o errexit

# inputs
DOTENV_FILE_OUT=.env.local
DOTENV_KEYS_OUT=.env.local.keys
X509_SUBJECT="/C=SG/O=ALP Dev"

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
GIT_BRANCH_NAME=$(git symbolic-ref --short HEAD 2> /dev/null)

# action
cd $GIT_BASE_DIR
source scripts/lib.sh

# note: sorted
echo '' > $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c 10) >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY=\'"$(DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE openssl genpkey -algorithm RSA -aes-256-cbc -pkeyopt rsa_keygen_bits:4096 -pass env:DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE -quiet)"\' >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__PUBLIC_KEY=\'"$(DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE openssl rsa -in <(echo "${DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY}") -pubout -passin env:DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE)"\' >> $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY=\'"${DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY}"\' >> $DOTENV_FILE_OUT # rc-v0.4.0-beta only

# if [ $GIT_BRANCH_NAME = rc-v0.4.0-beta ]; then
echo FHIR__CLIENT_ID=db6b2304-f236-45ec-b10c-a852681e7129 >> $DOTENV_FILE_OUT # until change tested
# echo FHIR__CLIENT_ID=$(uuidgen | tr '[:upper:]' '[:lower:]') >> $DOTENV_FILE_OUT

# note: sorted
echo FHIR__CLIENT_SECRET=$(random-password 64) >> $DOTENV_FILE_OUT
echo LOGTO_API_M2M_CLIENT_ID=$(random-password 21) >> $DOTENV_FILE_OUT
echo LOGTO_API_M2M_CLIENT_SECRET=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo MEILI_MASTER_KEY=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo MINIO__SECRET_KEY=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo PG_ADMIN_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo PG_SUPER_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo PG_WRITE_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo REDIS_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo STRATEGUS__KEYRING_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT

source $DOTENV_FILE_OUT
echo LOGTO__CLIENTID_PASSWORD__BASIC_AUTH=$(echo -n "${LOGTO_API_M2M_CLIENT_ID}:${LOGTO_API_M2M_CLIENT_SECRET}" | base64) >> $DOTENV_FILE_OUT
echo >> $DOTENV_FILE_OUT

# finalize
cat $DOTENV_FILE_OUT | grep = | awk -F= '{print $1}' | grep _ | sort -u > $DOTENV_KEYS_OUT
wc -l $DOTENV_FILE_OUT $DOTENV_KEYS_OUT | sed '$d'
echo
