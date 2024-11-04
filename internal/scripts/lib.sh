# library functions - sourced

function public-encrypt {
  PASSWORD_SALT="${1}"
  PASSWORD_PLAIN="${2}"
  echo "${PASSWORD_SALT}${PASSWORD_PLAIN}" | openssl pkeyutl -encrypt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -pubin -inkey <(echo $PUBLIC_KEY) | base64 -w0
}

function private-decrypt {
  PASSWORD_SALT="${1}"
  ENCRYPTED_PASSWORD="${2}"
  echo "${ENCRYPTED_PASSWORD}" | base64 -d | PRIVATE_KEY_PASSPHRASE=$PRIVATE_KEY_PASSPHRASE openssl pkeyutl -decrypt -inkey <(echo $PRIVATE_KEY) -passin env:PRIVATE_KEY_PASSPHRASE -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | sed "s/${PASSWORD_SALT}//"
}