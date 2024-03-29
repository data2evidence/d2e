# Environment Variables
key | type | comment 
--- | --- | --- 
DATABASE_CREDENTIALS | object | database connection configuration (credentials, tags, schema ...)
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY | rsaPrivateKey | 
DB_CREDENTIALS__INTERNAL__PRIVATE_KEY_PASSPHRASE | passphrase | 
DB_CREDENTIALS__INTERNAL__PUBLIC_KEY | x509publicKey | 
MEILI_MASTER_KEY | password | 
MINIO__SECRET_KEY | password | 
PG_ADMIN_PASSWORD | password | admin permissions
PG_SUPER_PASSWORD | password | all permissions
PG_WRITE_PASSWORD | password | write permissions only
POSTGRES_TENANT_ADMIN_PASSWORD | password | 
POSTGRES_TENANT_READ_PASSWORD | password | 