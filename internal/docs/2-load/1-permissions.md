## Set Postgres Permissions
- see: [1-permissions.md](https://github.com/alp-os/d2e/blob/develop/docs/2-load/1-permissions.md), [load-synpuf1k.sh](https://github.com/alp-os/d2e/blob/develop/internal/scripts/load-synpuf1k.sh)
- invoke
```bash
yarn load:permissions
```
- expected response 
```bash
. create read role
CREATE ROLE
. create admin role
CREATE ROLE
. create database
CREATE DATABASE
. alter admin role for schema creation
ALTER ROLE
. grant read permission for future objects to read role
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
. grant admin permission for future objects to admin role
GRANT
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
```