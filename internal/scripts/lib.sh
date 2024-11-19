# library functions - sourced

# openssl cli to mimic javascript core public-encrypt & private-decrypt
DOTENV_FILE_OUT=.env.$ENV_TYPE
# DOTENV_FILE_OUT=.env.local.ref
source $DOTENV_FILE_OUT

# avoids passing mult-line as parameter
PUBLIC_KEY="${DB_CREDENTIALS__INTERNAL__PUBLIC_KEY}"
PRIVATE_KEY="${DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY}"
PRIVATE_KEY_PASSPHRASE="${DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE}"

# debug
# PASSWORD_SALT=$POSTGRES_TENANT_ADMIN_PASSWORD_SALT # test
# PASSWORD_PLAIN=$POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN # test

# encrypt SALT & PLAIN text with PUBLIC_KEY
function public-encrypt {
  PASSWORD_SALT="${1}"
  PASSWORD_PLAIN="${2}"
  [ -z "${PASSWORD_SALT}" ] && echo FATAL PASSWORD_SALT is empty && exit 1
  [ -z "${PASSWORD_PLAIN}" ] && echo FATAL PASSWORD_PLAIN is empty && exit 1
  echo "${PASSWORD_SALT}${PASSWORD_PLAIN}" | openssl pkeyutl -encrypt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -pubin -inkey <(echo "${PUBLIC_KEY}") | base64 -w0
}

# test
# POSTGRES_TENANT_ADMIN_PASSWORD="$(public-encrypt $POSTGRES_TENANT_ADMIN_PASSWORD_SALT $POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN)"

# decrypt ENCRYPTED_PASSWORD with PUBLIC_KEY & remove PASSWORD_SALT
function private-decrypt {
  PASSWORD_SALT="${1}"
  ENCRYPTED_PASSWORD="${2}"
  [ -z "${PASSWORD_SALT}" ] && echo FATAL PASSWORD_SALT is empty && exit 1
  [ -z "${ENCRYPTED_PASSWORD}" ] && echo FATAL ENCRYPTED_PASSWORD is empty && exit 1
  echo "${ENCRYPTED_PASSWORD}" | base64 -d | PRIVATE_KEY_PASSPHRASE=$PRIVATE_KEY_PASSPHRASE openssl pkeyutl -decrypt -inkey <(echo "${PRIVATE_KEY}") -passin env:PRIVATE_KEY_PASSPHRASE -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | sed "s#${PASSWORD_SALT}##"
}

# test
# echo $POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN
# private-decrypt $POSTGRES_TENANT_ADMIN_PASSWORD_SALT $POSTGRES_TENANT_ADMIN_PASSWORD # test
# echo
# echo $POSTGRES_TENANT_READ_PASSWORD_PLAIN
# private-decrypt $POSTGRES_TENANT_READ_PASSWORD_SALT $POSTGRES_TENANT_READ_PASSWORD
# echo