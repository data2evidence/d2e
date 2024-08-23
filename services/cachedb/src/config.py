import os
import json
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


def get_env(var_name):
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = f"{var_name} is undefined"

        # Dont raise error if PYTHON_ENV is TEST
        if os.getenv("PYTHON_ENV") == "TEST":
            logger.info(error_msg)
            pass
        else:
            raise KeyError(error_msg)


def parse_int(var):
    if var is None:
        return None
    return int(var)


def parse_json(var):
    if var is None:
        return {}

    return json.loads(var)


@dataclass
class Env:
    LOCAL_DEBUG = get_env("LOCAL_DEBUG")
    DUCKDB__DATA_FOLDER = get_env("DUCKDB__DATA_FOLDER")
    TLS__INTERNAL__CA_CRT = get_env("TLS__INTERNAL__CA_CRT")
    IDP__SCOPE = get_env("IDP__SCOPE")
    IDP_SUBJECT_PROP = get_env("IDP_SUBJECT_PROP")
    PYTHON_VERIFY_SSL = get_env("PYTHON_VERIFY_SSL")
    CACHEDB__PORT = parse_int(get_env("CACHEDB__PORT"))
    CACHEDB__POOL_SIZE = parse_int(get_env("CACHEDB__POOL_SIZE"))
    DATABASE_CREDENTIALS = parse_json(get_env("DATABASE_CREDENTIALS"))
    SERVICE_ROUTES = parse_json(get_env("SERVICE_ROUTES"))
