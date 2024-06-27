# Environment Variables

## Manual Copy of Logto Apps Env

Look for the Logto App Client IDs & Secrets at the bottom of the logs and <b>copy them over to the</b> `.env.local` file thats printed in logs in the following format below
```
********************** COPY OVER ENV ASSIGNMENTS FOR LOGTO IN .env.local ***********************
LOGTO__ALP_SVC__CLIENT_ID=xxxxxxx
LOGTO__ALP_SVC__CLIENT_SECRET=xxxxxxx
LOGTO__ALP_DATA__CLIENT_ID=xxxxxxx
LOGTO__ALP_DATA__CLIENT_SECRET=xxxxxxx
LOGTO__ALP_APP__CLIENT_ID=xxxxxxx
LOGTO__ALP_APP__CLIENT_SECRET=xxxxxxx
************************************************************************************************
```


key | type | comment 
--- | --- | --- 
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY | rsaPrivateKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE | passphrase | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PUBLIC_KEY | x509publicKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DOCKER_TAG_NAME | string | default tag
LOGTO_API_M2M_CLIENT_ID | string | generated with logto APIs post init
LOGTO_API_M2M_CLIENT_SECRET | password | generated with logto APIs post init
LOGTO__ALP_ADMIN__CLIENT_ID | string | generated with logto APIs post init
LOGTO__ALP_ADMIN__CLIENT_SECRET | password | generated with logto APIs post init
LOGTO__ALP_APP__CLIENT_ID | string | generated with logto APIs post init
LOGTO__ALP_APP__CLIENT_SECRET | password | generated with logto APIs post init
LOGTO__ALP_SVC__CLIENT_ID | string | generated with logto APIs post init
LOGTO__ALP_SVC__CLIENT_SECRET | password | generated with logto APIs post init
MEILI_MASTER_KEY | password | meilisearch master key
MINIO__SECRET_KEY | password | meilisearch secret_key
PG_ADMIN_PASSWORD | password | admin permissions
PG_SUPER_PASSWORD | password | all permissions
PG_WRITE_PASSWORD | password | write permissions only
POSTGRES_TENANT_ADMIN_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
POSTGRES_TENANT_READ_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
