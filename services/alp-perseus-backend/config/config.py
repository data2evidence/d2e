import os

PORT = 5004
APP_PREFIX = '/backend'
VERSION = 0.4

try:
    DB_NAME = os.environ['PG__DB_NAME']
    DB_USER = os.environ['PG_ADMIN_USER']
    DB_PASSWORD = os.environ['PG_ADMIN_PASSWORD']
    DB_HOST = os.environ['PG__HOST']
    DB_PORT = os.environ['PG__PORT']
    API_HOST = os.environ['PERSEUS__FILES_MANAGER_HOST']

except KeyError as e:
    raise str(e)


class DockerConfig:
    AZURE_KEY_VAULT = False
    APP_LOGIC_DB_NAME = DB_NAME
    APP_LOGIC_DB_USER = DB_USER
    APP_LOGIC_DB_PASSWORD = DB_PASSWORD
    APP_LOGIC_DB_HOST = DB_HOST
    APP_LOGIC_DB_PORT = DB_PORT

    USER_SCHEMAS_DB_NAME = 'source'
    USER_SCHEMAS_DB_USER = DB_USER
    USER_SCHEMAS_DB_PASSWORD = DB_PASSWORD
    USER_SCHEMAS_DB_HOST = DB_HOST
    USER_SCHEMAS_DB_PORT = DB_PORT

    FILE_MANAGER_API_URL = f'http://{API_HOST}:10500/files-manager'
