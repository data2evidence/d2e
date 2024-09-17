import os
import logging
import duckdb

from config import Env


logger = logging.getLogger(__name__)


def get_cdw_config_duckdb_connection(database_code: str, schema: str) -> duckdb.DuckDBPyConnection:
    '''
    Get duckdb connection for cdw-config-svc
    First check if dynamically generated duckdb file is available, if not fallback to using built in duckdb file for cdw-config
    '''

    duckdb_file_name = f"{database_code}_{schema}"
    duckdb_file_path = _resolve_cdw_config_duckdb_file_path(duckdb_file_name)

    db = duckdb.connect()
    # Attach cdm schema
    db.execute(
        f"ATTACH '{duckdb_file_path}' AS {schema} (READ_ONLY);")
    return db


def _resolve_cdw_config_duckdb_file_path(duckdb_file_name: str) -> str:
    '''
    Checks if there is a duckdb file in CDW_SVC_DUCKDB_DATA_FOLDER, if there is a file there, use it.
    Else fallback to using the built in duckdb file in CDW_SVC_BUILT_IN_DUCKDB_DATA_FOLDER
    '''
    default_duckdb_file_path = f"{Env.CDW_SVC_DUCKDB_DATA_FOLDER}/{duckdb_file_name}"

    if os.path.isfile(default_duckdb_file_path):
        logger.info(f"Using duckdb file from {Env.CDW_SVC_DUCKDB_DATA_FOLDER}")
        return default_duckdb_file_path
    else:
        logger.info(f"Using built in duckdb file from {Env.CDW_SVC_BUILT_IN_DUCKDB_DATA_FOLDER}")
        return f"{Env.CDW_SVC_BUILT_IN_DUCKDB_DATA_FOLDER}/{duckdb_file_name}"
    