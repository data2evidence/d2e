# perseus

Runs [perseus](https://github.com/OHDSI/Perseus) within the alp network.

The currently supported perseus services are
- cdm-builder
- white-rabbit    
- backend
- user
- files-manager
- frontend
- shareddb and vocabularydb (inside alp postgres)

## Create databases
Ensure that `alp-minerva-postgres-1` container is running.

1. Create shared database
```bash
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE DATABASE shared;"`
```
- Expected successful response:
> CREATE DATABASE

2. Create vocabulary database

```bash
docker exec alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -c "CREATE DATABASE vocabulary;"
```
- Expected successful response:
> CREATE DATABASE

## Run application

This command starts perseus along with the alp services.
```bash
yarn start:minerva:perseus
```

- open `localhost:41180` to access the site
- default email: `perseus@softwarecountry.com`
- default password: `perseus`
