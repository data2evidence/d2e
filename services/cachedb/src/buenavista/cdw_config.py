import os
import logging

from config import Env

logger = logging.getLogger(__name__)

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
    