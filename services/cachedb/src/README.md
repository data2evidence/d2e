# Buena Vista: A Programmable Postgres Proxy Server

Buena Vista is a Python library that provides a [socketserver](https://docs.python.org/3/library/socketserver.html)-based implementation
of the [Postgres wire protocol (PDF)](https://beta.pgcon.org/2014/schedule/attachments/330_postgres-for-the-wire.pdf).

# Connection to cachedb supports two protocols which is expected in the database of the connection params.

1. Protocol A database param Format: `PROTOCOL|DIALECT|DATASETID`

   #### Example connection values with protocol A

   - host: `alp-cachedb`
   - post: `41191`
   - database: `A|dialect|11111111-2222-3333-4444-555555555555`
   - user: `jwt_token`

   Connection URL would be

   > "postgresql://jwt_token@alp-cachedb:41191/A|dialect|11111111-2222-3333-4444-555555555555"

2. Protocol B database param Format: `PROTOCOL|DIALECT|DATABASE_CODE|SCHEMA_NAME|VOCAB_SCHEMA_NAME`

   **_NOTE:_**

   - **Protocol B database access is only allowed for system admins**
   - **For access to postgresql and hana dialects, SCHEMA_NAME and VOCAB_SCHEMA_NAME values are optional**

   1. #### Example connection values with protocol B

      - host: `alp-cachedb`
      - post: `41191`
      - database: `B|dialect|alpdev_pg|cdmdefault|cdmvocab`
      - user: `jwt_token`

      Connection URL would be

      > "postgresql://jwt_token@alp-cachedb:41191/B|dialect|alpdev_pg|cdmdefault|cdmvocab"

   2. #### Example connection values with protocol B to postgresql without providing cdmdefault and cdmvocab in database parameter.

      - host: `alp-cachedb`
      - post: `41191`
      - database: `B|postgresql|alpdev_pg`
      - user: `jwt_token`

      Connection URL would be

      > "postgresql://jwt_token@alp-cachedb:41191/B|duckdb|alpdev_pg|cdmdefault|cdmvocab"

### Extra info:

Currently supported dialects are

1. duckdb
2. postgresql
3. hana

# To run tests

Attach shell into `alp-cachedb` container, navigate to the directory `/home/docker/src` and run.

```
PYTHON_ENV=TEST python3 -m pytest
```
