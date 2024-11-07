# library functions - sourced

function public-encrypt {
  PASSWORD_SALT="${1}"
  PASSWORD_PLAIN="${2}"
  echo "${PASSWORD_SALT}${PASSWORD_PLAIN}" | openssl pkeyutl -encrypt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -pubin -inkey <(echo $PUBLIC_KEY) | base64 -w0
}

function private-decrypt {
  PASSWORD_SALT="${1}"
  ENCRYPTED_PASSWORD="${2}"
  echo "${ENCRYPTED_PASSWORD}" | base64 -d | PRIVATE_KEY_PASSPHRASE=$PRIVATE_KEY_PASSPHRASE openssl pkeyutl -decrypt -inkey <(echo $PRIVATE_KEY) -passin env:PRIVATE_KEY_PASSPHRASE -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | sed "s#${PASSWORD_SALT}##"
}

PUBLIC_KEY=${DB_CREDENTIALS__INTERNAL__PUBLIC_KEY}
# echo PUBLIC_KEY=$PUBLIC_KEY
PRIVATE_KEY=$DB_CREDENTIALS__INTERNAL__PRIVATE_KEY
# echo PRIVATE_KEY=$PRIVATE_KEY
PRIVATE_KEY_PASSPHRASE=${DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE}
# echo PRIVATE_KEY_PASSPHRASE=$PRIVATE_KEY_PASSPHRASE

# test
[ $POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN != $(private-decrypt $POSTGRES_TENANT_ADMIN_PASSWORD_SALT $POSTGRES_TENANT_ADMIN_PASSWORD) ] && echo FATAL private-decrypt POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN mismatch
[ $POSTGRES_TENANT_READ_PASSWORD_PLAIN != $(private-decrypt $POSTGRES_TENANT_READ_PASSWORD_SALT $POSTGRES_TENANT_READ_PASSWORD) ] && echo FATAL private-decrypt POSTGRES_TENANT_READ_PASSWORD_PLAIN mismatch