## Manual Copy ENVs to .env.private.yml

Because of reuse of passwords from base files in 1Password, please ensure the following local specific variables are present in your **.env.private.yml**

<i>When porting over, <b>Replace</b> `key=value` -> `key: value` format </i>

- DB_CREDENTIALS__INTERNAL__PRIVATE_KEY
- DB_CREDENTIALS__INTERNAL__DECRYPT_PRIVATE_KEY
- DB_CREDENTIALS__INTERNAL__PUBLIC_KEY
- LOGTO_API_M2M_CLIENT_ID
- LOGTO_API_M2M_CLIENT_SECRET
- LOGTO__CLIENTID_PASSWORD__BASIC_AUTH
- LOGTO__ALP_SVC__CLIENT_ID
- LOGTO__ALP_SVC__CLIENT_SECRET
- LOGTO__ALP_DATA__CLIENT_ID
- LOGTO__ALP_DATA__CLIENT_SECRET
- LOGTO__ALP_APP__CLIENT_ID
- LOGTO__ALP_APP__CLIENT_SECRET
