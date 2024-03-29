## Database

### Setup
Add `.env` file with below values:
```
PG__HOST=localhost
PG__PORT=41190
PG__DB_CREDENTIALS_MGR__DB_NAME=alp
PG__DB_CREDENTIALS_MGR__MANAGE_USER=-alp_pg_admin_user
PG__DB_CREDENTIALS_MGR__MANAGE_PASSWORD=<PG Manage User Password>
PG__DB_CREDENTIALS_MGR__SCHEMA=db_credentials_mgr
```

Before generating a new migration script, do create/update entity classes `*.entity.ts` in `entity` folders and run
```
yarn migration:generate <migration-name>
```
It creates a file with 2 functions `up` and `down`. Write the migration script in `up` and the rollback script in `down` functions.

Once the new migration script is created, you can run `yarn migrate` to execute the script defined in `up` function.

If you would like to rollback the latest migration, run `yarn rollback`. And it will execute the script defined in `down` function.