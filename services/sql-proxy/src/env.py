import os
import json


def get_env(var_name):
    try:
        return os.environ[var_name]
    except KeyError:
        raise KeyError(f"{var_name} is undefined")


env = {
    "LOCAL_DEBUG": get_env("LOCAL_DEBUG"),
    "DUCKDB__DATA_FOLDER": get_env("DUCKDB__DATA_FOLDER"),
    "TLS__INTERNAL__CA_CRT": get_env("TLS__INTERNAL__CA_CRT"),
    "IDP__SCOPE": get_env("IDP__SCOPE"),
    "IDP_SUBJECT_PROP": get_env("IDP_SUBJECT_PROP"),
    "PYTHON_VERIFY_SSL": get_env("PYTHON_VERIFY_SSL"),
    "SQL_PROXY__PORT": int(get_env("SQL_PROXY__PORT")),
    "SQL_PROXY__POOL_SIZE": int(get_env("SQL_PROXY__POOL_SIZE")),
    "DATABASE_CREDENTIALS": json.loads(get_env("DATABASE_CREDENTIALS")),
    "SERVICE_ROUTES": json.loads(get_env("SERVICE_ROUTES")),
}
