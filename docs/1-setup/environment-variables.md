# Environment Variables
key | type | comment 
--- | --- | --- 
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY | rsaPrivateKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE | passphrase | to encrypt dbcredentials entered in admin>setup>databases>configure
DB_CREDENTIALS__INTERNAL__PUBLIC_KEY | x509publicKey | to encrypt dbcredentials entered in admin>setup>databases>configure
DOCKER_TAG_NAME | string | default tag
LOGTO_API_M2M_CLIENT_ID | password | logto static secrets matching deploy/logto/seed.sql - randomize with API later
LOGTO_API_M2M_CLIENT_SECRET | password | logto static secrets matching deploy/logto/seed.sql - randomize with API later
LOGTO__ALP_ADMIN__CLIENT_SECRET | password | logto static secrets matching deploy/logto/seed.sql - randomize with API later
LOGTO__ALP_APP__CLIENT_SECRET | password | logto static secrets matching deploy/logto/seed.sql - randomize with API later
LOGTO__ALP_SVC__CLIENT_SECRET | password | logto static secrets matching deploy/logto/seed.sql - randomize with API later
MEILI_MASTER_KEY | password | meilisearch master key
MINIO__SECRET_KEY | password | meilisearch secret_key
PG_ADMIN_PASSWORD | password | admin permissions
PG_SUPER_PASSWORD | password | all permissions
PG_WRITE_PASSWORD | password | write permissions only
POSTGRES_TENANT_ADMIN_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
POSTGRES_TENANT_READ_PASSWORD | password | set in admin>setup>databases>configure but not in env.example
