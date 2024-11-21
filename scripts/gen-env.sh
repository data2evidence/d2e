#!/usr/bin/env bash
# generate dotenv file with passwords, certificates,
# set -o nounset
# set -o errexit

# inputs
DOTENV_FILE_OUT=.env.local
DOTENV_KEYS_OUT=.env.local.keys
X509_SUBJECT="/C=SG/O=ALP Dev"
DOTENV_APPEND=${DOTENV_APPEND:-false}

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
GIT_BRANCH_NAME=$(git symbolic-ref --short HEAD 2> /dev/null)

# action
cd $GIT_BASE_DIR
source $GIT_BASE_DIR/scripts/lib.sh

# note: sorted
if [ $DOTENV_APPEND = true ]; then
	echo INFO append $DOTENV_FILE_OUT
else
	echo INFO new $DOTENV_FILE_OUT
	echo '' > $DOTENV_FILE_OUT
fi

echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$(random-password 41) >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY=\'"$(DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE openssl genpkey -algorithm RSA -aes-256-cbc -pkeyopt rsa_keygen_bits:4096 -pass env:DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE -quiet)"\' >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__PUBLIC_KEY=\'"$(DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE openssl rsa -in <(echo "${DB_CREDENTIALS__INTERNAL__PRIVATE_KEY}") -pubout -passin env:DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE)"\' >> $DOTENV_FILE_OUT
echo DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY=\'"$(DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE openssl rsa -in <(echo "${DB_CREDENTIALS__INTERNAL__PRIVATE_KEY}") -passin env:DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE)"\' >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT # task to remove from dc.yml?

echo DATABASE_CREDENTIALS=\'[]\' >> $DOTENV_FILE_OUT # => task to not require explicit \'[]\'

echo FHIR__CLIENT_ID=$(random-uuid) >> $DOTENV_FILE_OUT
echo FHIR__CLIENT_SECRET=$(random-uuid) >> $DOTENV_FILE_OUT

echo LOGTO_API_M2M_CLIENT_ID=$(random-password 21) >> $DOTENV_FILE_OUT
echo LOGTO_API_M2M_CLIENT_SECRET=$(random-password 32) >> $DOTENV_FILE_OUT; source $DOTENV_FILE_OUT
echo LOGTO__CLIENTID_PASSWORD__BASIC_AUTH=$(echo -n "${LOGTO_API_M2M_CLIENT_ID}:${LOGTO_API_M2M_CLIENT_SECRET}" | base64) >> $DOTENV_FILE_OUT

echo MEILI_MASTER_KEY=$(random-uuid) >> $DOTENV_FILE_OUT
echo MINIO__SECRET_KEY=$(random-uuid) >> $DOTENV_FILE_OUT
echo PG_ADMIN_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo PG_SUPER_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo PG_WRITE_PASSWORD=$(random-password $DEFAULT_PASSWORD_LENGTH) >> $DOTENV_FILE_OUT
echo REDIS_PASSWORD=$(random-uuid) >> $DOTENV_FILE_OUT
echo STRATEGUS__KEYRING_PASSWORD=$(random-uuid) >> $DOTENV_FILE_OUT

echo >> $DOTENV_FILE_OUT

# finalize
cat $DOTENV_FILE_OUT | grep = | awk -F= '{print $1}' | grep _ | sort -u > $DOTENV_KEYS_OUT
wc -l $DOTENV_FILE_OUT $DOTENV_KEYS_OUT | sed '$d'
echo
