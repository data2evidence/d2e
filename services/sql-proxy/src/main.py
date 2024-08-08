import debugpy
from typing import Tuple
from buenavista import postgres
from buenavista.database import initialize_db_clients, SqlProxyDatabaseClients
from env import env

import logging


def create(
    db_clients: SqlProxyDatabaseClients, host_addr: Tuple[str, int], auth: dict = None
) -> postgres.BuenaVistaServer:
    server = postgres.BuenaVistaServer(
        db_clients, host_addr, auth=auth
    )
    return server


def main():
    if env["LOCAL_DEBUG"] == "true":
        debugpy.listen(("0.0.0.0", 9235))
        logging.basicConfig(level=logging.DEBUG)

        port = env["SQL_PROXY__PORT"]

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
