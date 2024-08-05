import debugpy
from buenavista import bv_dialects, postgres, rewrite
from buenavista.backends.duckdb import DuckDBConnection
import os
import sys
from typing import Tuple

import duckdb
import logging


class DuckDBPostgresRewriter(rewrite.Rewriter):
    def rewrite(self, sql: str) -> str:
        if sql.lower() == "select pg_catalog.version()":
            return "SELECT 'PostgreSQL 9.3' as version"
        else:
            return super().rewrite(sql)


rewriter = DuckDBPostgresRewriter(
    bv_dialects.BVPostgres(), bv_dialects.BVDuckDB())


def create(
    host_addr: Tuple[str, int], auth: dict = None
) -> postgres.BuenaVistaServer:
    server = postgres.BuenaVistaServer(
        host_addr, rewriter=rewriter, auth=auth
    )
    return server


def main():
    if "LOCAL_DEBUG" in os.environ:
        if os.environ["LOCAL_DEBUG"] == "true":
            debugpy.listen(("0.0.0.0", 9235))
            logging.basicConfig(level=logging.DEBUG)

    if "SQL_PROXY__PORT" in os.environ:
        port = int(os.environ["SQL_PROXY__PORT"])

    address = ("0.0.0.0", port)
    server = create(address)
    ip, port = server.server_address
    print(f"Listening on {ip}:{port}")

    try:
        server.serve_forever()
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
