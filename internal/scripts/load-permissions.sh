#!/usr/bin/env bash
# Postgres `alpdev_pg` database and user initialization
# based on docs/2-load/3-setup-pg-permissions.md

set -o nounset
set -o errexit
set -o pipefail
echo ${0} ...

# inputs
ENV_TYPE=${ENV_TYPE:-local}

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
DOTENV_PATH=$GIT_BASE_DIR/.env.$ENV_TYPE

# action
[ ! -f $DOTENV_PATH ] && echo "FATAL $DOTENV_PATH not found" && exit 1
source $DOTENV_PATH

[ -z "${POSTGRES_TENANT_READ_PASSWORD_PLAIN}" ] && echo "FATAL POSTGRES_TENANT_READ_PASSWORD_PLAIN not set" && exit 1
[ -z "${POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN}" ] && echo "FATAL POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN not set" && exit 1
POSTGRES_TENANT_READ_PASSWORD=$POSTGRES_TENANT_READ_PASSWORD_PLAIN; echo POSTGRES_TENANT_READ_PASSWORD=$POSTGRES_TENANT_READ_PASSWORD
POSTGRES_TENANT_ADMIN_PASSWORD=$POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN; echo POSTGRES_TENANT_ADMIN_PASSWORD=$POSTGRES_TENANT_ADMIN_PASSWORD


echo . create read role
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE ROLE postgres_tenant_read_user NOSUPERUSER LOGIN ENCRYPTED PASSWORD '${POSTGRES_TENANT_READ_PASSWORD_PLAIN}';"
# expect `CREATE ROLE`
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE ROLE postgres_tenant_read_role;"
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "GRANT postgres_tenant_read_role to postgres_tenant_read_user;"

echo . create admin role
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE ROLE postgres_tenant_admin_user NOSUPERUSER LOGIN ENCRYPTED PASSWORD '${POSTGRES_TENANT_ADMIN_PASSWORD_PLAIN}';"

echo . Create database alpdev_pg
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE DATABASE alpdev_pg;"

echo . Alter admin role for schema creation
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg -c "ALTER ROLE postgres_tenant_admin_user CREATEROLE NOSUPERUSER NOCREATEDB NOREPLICATION NOBYPASSRLS;"

echo . Grant read permission for future objects to read role
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg -c "ALTER DEFAULT PRIVILEGES GRANT SELECT ON TABLES TO postgres_tenant_read_user; ALTER DEFAULT PRIVILEGES GRANT USAGE, SELECT ON SEQUENCES TO postgres_tenant_read_user; ALTER DEFAULT PRIVILEGES GRANT EXECUTE ON FUNCTIONS TO postgres_tenant_read_user;"

echo . Grant admin permission for future objects to admin role
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg -c "GRANT CREATE ON DATABASE alpdev_pg TO postgres_tenant_admin_user WITH GRANT OPTION; ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO postgres_tenant_admin_user WITH GRANT OPTION; ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO postgres_tenant_admin_user WITH GRANT OPTION; ALTER DEFAULT PRIVILEGES GRANT ALL ON FUNCTIONS TO postgres_tenant_admin_user WITH GRANT OPTION;"