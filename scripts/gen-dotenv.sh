#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# constants
env_file=.env.local
example_file=env.example
tmp_file=.env.tmp

passphrase_length=10
default_password_length=30
x509_subject="/C=SG/O=ALP Dev"

# vars
echo '' > $tmp_file 
echo '' > $env_file

# passwords
echo set-passwords ...
function set-password {
    export password_name=$1
    export password_length=$2
    echo INFO set password:$password_name ...
    export password_value=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c $password_length)
    echo ${password_name}=${password_value} >> $tmp_file
}

password_keys=($(cat $example_file | grep password$ | awk -F= '{print $1}')) # echo ${password_keys[@]}; 
password_name=${password_keys[1]}
for password_name in ${password_keys[@]}; do
    length=$default_password_length
    if [ $password_name = "LOGTO_API_M2M_CLIENT_ID" ]; then
        length=21
    fi
    set-password $password_name $length
done
echo

echo set-openssl ...
# https://www.openssl.org/docs/man3.0/man1/openssl-passphrase-options.html
function set-openssl {
    echo INFO set DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE DB_CREDENTIALS__INTERNAL__PRIVATE_KEY DB_CREDENTIALS__INTERNAL__PUBLIC_KEY ...
    export PASSPHRASE=$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c $passphrase_length)
    export PRIVATE_KEY=$(openssl genpkey -algorithm RSA -aes-256-cbc -pkeyopt rsa_keygen_bits:4096 -pass env:PASSPHRASE -quiet)
    export PUBLIC_KEY=$(echo "${PRIVATE_KEY}" | openssl rsa -pubout -passin env:PASSPHRASE)
    export DECRYPT_PRIVATE_KEY=$(echo "${PRIVATE_KEY}" | openssl rsa -passin env:PASSPHRASE)
    echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE=\"${PASSPHRASE}\" >> $tmp_file
    echo DB_CREDENTIALS__INTERNAL__PRIVATE_KEY=\'"${PRIVATE_KEY}"\' >> $tmp_file
    echo DB_CREDENTIALS__INTERNAL__PUBLIC_KEY=\'"${PUBLIC_KEY}"\' >> $tmp_file
    echo DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY=\'"${DECRYPT_PRIVATE_KEY}"\' >> $tmp_file
}
set-openssl
echo

echo encode-basic-auth ...
encode-basic-auth() {
    echo INFO set LOGTO__CLIENTID_PASSWORD__BASIC_AUTH ...
    client_id=$(grep '^LOGTO_API_M2M_CLIENT_ID=' "$tmp_file" | cut -d"=" -f2)
    client_secret=$(grep '^LOGTO_API_M2M_CLIENT_SECRET=' "$tmp_file" | cut -d"=" -f2)
    encoded_basic_auth=$(echo -n "${client_id}:${client_secret}" | base64)
    echo LOGTO__CLIENTID_PASSWORD__BASIC_AUTH=${encoded_basic_auth} >> $tmp_file
}
encode-basic-auth
echo

bash -c "set -a; source $tmp_file; cat $example_file | envsubst > $env_file"
echo >> $env_file

# finish
wc -l $env_file