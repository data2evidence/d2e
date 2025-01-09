# Environment Variables

key | type | comment 
--- | --- | --- 
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY | rsaPrivateKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE | passphrase | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PUBLIC_KEY | x509publicKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DOCKER_TAG_NAME | string | default tag
MINIO__SECRET_KEY | password | minio secret_key
TLS__INTERNAL__CA_CRT | PEM | generated
LOGTO_API_M2M_CLIENT_ID | password | generated
LOGTO_API_M2M_CLIENT_SECRET | password | generated
LOGTO__CLIENTID_PASSWORD__BASIC_AUTH | base64 encoded | generated
LOGTO__ALP_APP__CLIENT_ID | string | generated
LOGTO__ALP_APP__CLIENT_SECRET | password | generated
LOGTO__ALP_SVC__CLIENT_ID | string | generated
LOGTO__ALP_SVC__CLIENT_SECRET | password | generated
LOGTO__ALP_DATA__CLIENT_ID | string | generated
LOGTO__ALP_DATA__CLIENT_SECRET | password | generated
PG_ADMIN_PASSWORD | password | admin permissions
PG_SUPER_PASSWORD | password | all permissions
PG_WRITE_PASSWORD | password | write permissions only
POSTGRES_TENANT_ADMIN_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
POSTGRES_TENANT_READ_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
REDIS_PASSWORD | password | all permissions
DICOM__HEALTH_CHECK_PASSWORD | password | static secret to be generated later
STRATEGUS__KEYRING_PASSWORD | password | default Keyring password
