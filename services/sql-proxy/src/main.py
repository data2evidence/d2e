from buenavista import bv_dialects, postgres, rewrite
from buenavista.backends.duckdb import DuckDBConnection
import os
import sys
from typing import Tuple

import duckdb
import logging


if os.environ["LOCAL_DEBUG"] == "true":
    logging.basicConfig(level=logging.DEBUG)


class DuckDBPostgresRewriter(rewrite.Rewriter):
    def rewrite(self, sql: str) -> str:
        if sql.lower() == "select pg_catalog.version()":
            return "SELECT 'PostgreSQL 9.3' as version"
        else:
            return super().rewrite(sql)


rewriter = DuckDBPostgresRewriter(
    bv_dialects.BVPostgres(), bv_dialects.BVDuckDB())


def create(
    db: duckdb.DuckDBPyConnection, host_addr: Tuple[str, int], auth: dict = None
) -> postgres.BuenaVistaServer:
    server = postgres.BuenaVistaServer(
        host_addr, DuckDBConnection(db), rewriter=rewriter, auth=auth
    )
    return server


def main():
    if len(sys.argv) < 2:
        print("Using in-memory DuckDB database")
        db = duckdb.connect()
        db.execute(
            "ATTACH '/home/docker/duckdb_data/alpdev_pg_cdmdefault' (READ_ONLY);")
    else:
        print("Using DuckDB database at %s" % sys.argv[1])
        db = duckdb.connect(sys.argv[1])

    if "SQL_PROXY__PORT" in os.environ:
        port = int(os.environ["SQL_PROXY__PORT"])

    address = ("0.0.0.0", port)
    server = create(db, address)
    ip, port = server.server_address
    print(f"Listening on {ip}:{port}")

    try:
        server.serve_forever()
    finally:
        server.shutdown()
        db.close()


if __name__ == "__main__":
    main()
