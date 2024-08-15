# Buena Vista: A Programmable Postgres Proxy Server

Buena Vista is a Python library that provides a [socketserver](https://docs.python.org/3/library/socketserver.html)-based implementation
of the [Postgres wire protocol (PDF)](https://beta.pgcon.org/2014/schedule/attachments/330_postgres-for-the-wire.pdf).

# To run tests

Attach shell into `alp-sql-proxy` container, navigate to the directory `/home/docker/src` and run.

```
PYTHON_ENV=TEST python3 -m pytest
```
