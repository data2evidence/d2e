import debugpy
import os
from typing import Tuple
from buenavista import bv_dialects, postgres, rewrite
from buenavista.backends.duckdb import DuckDBConnection
from buenavista.core import Connection
from buenavista.database import initialize_db_clients, SqlProxyDatabaseClients


import logging


def create(
    db_clients: SqlProxyDatabaseClients, host_addr: Tuple[str, int], auth: dict = None
) -> postgres.BuenaVistaServer:
    server = postgres.BuenaVistaServer(
        db_clients, host_addr, auth=auth
    )
    return server


def main():
    if "LOCAL_DEBUG" in os.environ:
        if os.environ["LOCAL_DEBUG"] == "true":
            debugpy.listen(("0.0.0.0", 9235))
            logging.basicConfig(level=logging.DEBUG)

    if "SQL_PROXY__PORT" in os.environ:
        port = int(os.environ["SQL_PROXY__PORT"])

    db_clients = initialize_db_clients()
    address = ("0.0.0.0", port)
    server = create(db_clients, address)
    ip, port = server.server_address
    print(f"Listening on {ip}:{port}")

    try:
        server.serve_forever()
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
