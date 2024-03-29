import os
import nipyapi

def setup_nifi_config():
    for env in ['NIFI__BASE_URL', 'NIFI__CA_CERT_PATH', 'NIFI__CERT_PATH', 'NIFI__KEY_PATH']:
        _check_for_missing_env(env)

    for env in ['NIFI__CA_CERT_PATH', 'NIFI__CERT_PATH', 'NIFI__KEY_PATH']:
        _check_for_invalid_env_path(env)

    nipyapi.config.nifi_config.host = os.getenv('NIFI__BASE_URL')
    nipyapi.config.nifi_config.ssl_ca_cert = os.getenv('NIFI__CA_CERT_PATH')
    nipyapi.config.nifi_config.cert_file = os.getenv('NIFI__CERT_PATH')
    nipyapi.config.nifi_config.key_file = os.getenv('NIFI__KEY_PATH')

def setup_nifi_registry_config():
    for env in ['NIFI_REGISTRY__BASE_URL', 'NIFI_REGISTRY__CA_CERT_PATH', 'NIFI_REGISTRY__CERT_PATH', 'NIFI_REGISTRY__KEY_PATH']:
        _check_for_missing_env(env)

    for env in ['NIFI_REGISTRY__CA_CERT_PATH', 'NIFI_REGISTRY__CERT_PATH', 'NIFI_REGISTRY__KEY_PATH']:
        _check_for_invalid_env_path(env)

    nipyapi.config.registry_config.host = os.getenv('NIFI_REGISTRY__BASE_URL')
    nipyapi.config.registry_config.ssl_ca_cert = os.getenv('NIFI_REGISTRY__CA_CERT_PATH')
    nipyapi.config.registry_config.cert_file = os.getenv('NIFI_REGISTRY__CERT_PATH')
    nipyapi.config.registry_config.key_file = os.getenv('NIFI_REGISTRY__KEY_PATH')

def _check_for_missing_env(env_name):
    if os.getenv(env_name) is None:   
        raise ValueError(f'{env_name} environment variable is missing.')

def _check_for_invalid_env_path(env_name):
    if os.path.exists(os.getenv(env_name)) == False:   
        invalid_path: str = os.getenv(env_name)
        raise ValueError(f'{invalid_path} is a invalid {env_name} environment variable path.')
