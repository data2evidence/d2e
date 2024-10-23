#!/usr/bin/env bash
# generate dotenv file with passwords, certificates,
set -o nounset
set -o errexit

# inputs
DEFAULT_PASSWORD_LENGTH=30
ENV_FILE=.env.local
EXAMPLE_FILE=env.example
PASSPHRASE_LENGTH=10
PASSWORD_NAMES_FILE=scripts/list-passwords.txt
TMP_FILE=.env.tmp
X509_SUBJECT="/C=SG/O=ALP Dev"

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"

# action
cd $GIT_BASE_DIR
PASSWORD_NAMES=($(cat $PASSWORD_NAMES_FILE))
echo '' > $TMP_FILE
echo '' > $ENV_FILE

# passwords
echo set random passwords ...
function set-password {
    export PASSWORD_NAME=$1
    export PASSWORD_LENGTH=$2
    echo INFO set password:$PASSWORD_NAME ...
    export PASSWORD_VALUE=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c $PASSWORD_LENGTH)
    echo ${PASSWORD_NAME}=${PASSWORD_VALUE} >> $TMP_FILE
}

PASSWORD_NAME=${PASSWORD_NAMES[1]}
for PASSWORD_NAME in ${PASSWORD_NAMES[@]}; do
    PASSWORD_LENGTH=$DEFAULT_PASSWORD_LENGTH
    if [ $PASSWORD_NAME = "LOGTO_API_M2M_CLIENT_ID" ]; then
        PASSWORD_LENGTH=21
    fi
    set-password $PASSWORD_NAME $PASSWORD_LENGTH
done
echo

# https://www.openssl.org/docs/man3.0/man1/openssl-passphrase-options.html
function set-openssl {
    echo "set openssl DB_CREDENTIALS public, private key, passphrase ..."
    echo INFO set DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE DB_CREDENTIALS__INTERNAL__PRIVATE_KEY DB_CREDENTIALS__INTERNAL__PUBLIC_KEY ...
    export PASSPHRASE=$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c $PASSPHRASE_LENGTH)
    export PRIVATE_KEY=$(openssl genpkey -algorithm RSA -aes-256-cbc -pkeyopt rsa_keygen_bits:4096 -pass env:PASSPHRASE -quiet)
    export PUBLIC_KEY=$(echo "${PRIVATE_KEY}" | openssl rsa -pubout -passin env:PASSPHRASE)
    echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=\"${PASSPHRASE}\" >> $TMP_FILE
    echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY=\'"${PRIVATE_KEY}"\' >> $TMP_FILE
    echo DB_CREDENTIALS__INTERNAL__PUBLIC_KEY=\'"${PUBLIC_KEY}"\' >> $TMP_FILE
}
set-openssl
echo

encode-basic-auth() {
    echo encode-basic-auth ...
    echo INFO set LOGTO__CLIENTID_PASSWORD__BASIC_AUTH ...
    source $TMP_FILE
    encoded_basic_auth=$(echo -n "${LOGTO_API_M2M_CLIENT_ID}:${LOGTO_API_M2M_CLIENT_SECRET}" | base64)
    echo LOGTO__CLIENTID_PASSWORD__BASIC_AUTH=${encoded_basic_auth} >> $TMP_FILE
}
encode-basic-auth
echo

# Substitute shell variables in EXAMPLE_FILE. Variables exported in sub-shell.
bash -c "set -a; source $TMP_FILE; cat $EXAMPLE_FILE | envsubst > $ENV_FILE"
echo >> $ENV_FILE

# finish
wc -l $ENV_FILE
echo