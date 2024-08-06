import threading
import time
import pytest

import duckdb
import psycopg
from sqlalchemy import create_engine, text


from main import create


mp = pytest.MonkeyPatch()
mp.setenv('DUCKDB__DATA_FOLDER', '/home/docker/src/tests/data/')


@pytest.fixture(scope="session")
def db():
    db = duckdb.connect("tests/data/testdbcode_testschema", read_only=True)
    yield db
    db.close()


@pytest.fixture(scope="session")
def user_password():
    return {"postgres": "postgres1729"}


@pytest.fixture(scope="session")
def duckdb_postgres_server(db, user_password):
    try:
        server = create(db, ("localhost", 5444), auth=user_password)
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        time.sleep(1)  # wait for server to start
        yield server
    finally:
        server.shutdown()
        server.server_close()


@pytest.fixture(scope="session")
def conn(duckdb_postgres_server, user_password):
    assert duckdb_postgres_server is not None
    user, password = list(user_password.items())[0]
    conn_str = f"postgresql://{user}:{password}@localhost:5444/duckdb-testdbcode-testschema"
    connection = psycopg.connect(conn_str)
    yield connection
    connection.close()


def test_select(conn):
    cur = conn.cursor()
    cur.execute("SELECT 1")
    assert cur.fetchone() == (1,)
    cur.close()


def test_pg_version(conn):
    cur = conn.cursor()
    cur.execute("SELECT pg_catalog.version()")
    assert cur.fetchone() == ("PostgreSQL 9.3",)
    cur.close()


@pytest.fixture(scope="session")
def sqlalchemy_conn(duckdb_postgres_server, user_password):
    assert duckdb_postgres_server is not None
    user, password = list(user_password.items())[0]
    conn_string = f"postgresql+psycopg2://{user}:{password}@localhost:5444/duckdb-testdbcode-testschema"
    engine = create_engine(conn_string)
    conn = engine.connect()
    yield conn
    conn.close()
    engine.dispose()


def test_sqlalchemy_select(sqlalchemy_conn):
    result = sqlalchemy_conn.execute(
        text("SELECT * from testschema.person where person_id = 1;")).fetchone()
    assert result == (1, 8507, 1923, 5, 1, None, 8527, 38003564,
                      1, None, None, '00013D2EFD8E45D1', 1, None, 1, None, 1, None)


def test_sqlalchemy_parameterized_select(sqlalchemy_conn):
    stmt = text("SELECT * FROM testschema.person WHERE person_id = :x")
    stmt = stmt.bindparams(x="1")
    result = sqlalchemy_conn.execute(stmt).fetchone()
    assert result == (1, 8507, 1923, 5, 1, None, 8527, 38003564,
                      1, None, None, '00013D2EFD8E45D1', 1, None, 1, None, 1, None)
