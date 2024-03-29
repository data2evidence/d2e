import pytest
import nipyapi

from libs.controller import Controller

@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('NIFI__BASE_URL', 'https://localhost/nifi-api')
    monkeypatch.setenv('NIFI__CA_CERT_PATH', './keys/LOCAL_NIFI_CA_CERT')
    monkeypatch.setenv('NIFI__CERT_PATH', './keys/LOCAL_NIFI_CLIENT_CERT')
    monkeypatch.setenv('NIFI__KEY_PATH', './keys/LOCAL_NIFI_CLIENT_KEY')
    monkeypatch.setenv('NIFI_REGISTRY__BASE_URL', 'https://localhost:18083/nifi-registry-api')
    monkeypatch.setenv('NIFI_REGISTRY__CA_CERT_PATH', './keys/LOCAL_NIFI_REGISTRY_CA_CERT')
    monkeypatch.setenv('NIFI_REGISTRY__CERT_PATH', './keys/LOCAL_NIFI_REGISTRY_CLIENT_CERT')
    monkeypatch.setenv('NIFI_REGISTRY__KEY_PATH', './keys/LOCAL_NIFI_REGISTRY_CLIENT_KEY')

# Test get_nifi_registry_client_list_in_nifi
def test_get_nifi_registry_client_list_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_list_registry_clients():
        return nipyapi.nifi.RegistryClientsEntity(
            registries = [
                nipyapi.nifi.RegistryClientEntity(
                    bulletins = None,
                    component = nipyapi.nifi.RegistryDTO(
                        description = '',
                        id = '8dba9e1b-017b-1000-0802-c1236649610f',
                        name = 'Nifi Registry - 1',
                        uri = 'https://localhost:18083'
                    ),
                    disconnected_node_acknowledged = None,
                    id = '8dba9e1b-017b-1000-0802-c1236649610f',
                    permissions = nipyapi.nifi.PermissionsDTO(
                        can_read = True, 
                        can_write = True
                    ),
                    position = None,
                    revision = nipyapi.nifi.RevisionDTO(
                        client_id = None,
                        last_modifier = None,
                        version = 1
                    ),
                    uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
                ), 
                nipyapi.nifi.RegistryClientEntity(
                    bulletins = None,
                    component = nipyapi.nifi.RegistryDTO(
                        description = '',
                        id = '999a9e1b-017b-1000-0802-c12366499999',
                        name = 'Nifi Registry - 2',
                        uri = 'https://localhost:28083'
                    ),
                    disconnected_node_acknowledged = None,
                    id = '999a9e1b-017b-1000-0802-c12366499999',
                    permissions = nipyapi.nifi.PermissionsDTO(
                        can_read = True, 
                        can_write = True
                    ),
                    position = None,
                    revision = nipyapi.nifi.RevisionDTO(
                        client_id = None,
                        last_modifier = None,
                        version = 1
                    ),
                    uri = 'https://localhost/nifi-api/controller/registry-clients/999a9e1b-017b-1000-0802-c12366499999'
                )
            ]
        )

    monkeypatch.setattr(nipyapi.versioning, 'list_registry_clients', mock_nipyapi_versioning_list_registry_clients)

    # Act & Assert
    assert Controller().get_nifi_registry_client_list_in_nifi() is not None

def test_get_nifi_registry_client_list_in_nifi_with_missing_registry_client(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_list_registry_clients():
        return nipyapi.nifi.RegistryClientsEntity(
            registries = []
        )

    monkeypatch.setattr(nipyapi.versioning, 'list_registry_clients', mock_nipyapi_versioning_list_registry_clients)

    # Act & Assert
    assert getattr(Controller().get_nifi_registry_client_list_in_nifi(), 'registries') == []

def test_get_nifi_registry_client_list_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_list_registry_clients():
        raise ValueError('API error with list registry clients.')

    monkeypatch.setattr(nipyapi.versioning, 'list_registry_clients', mock_nipyapi_versioning_list_registry_clients)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().get_nifi_registry_client_list_in_nifi()
    
    # Assert
    assert 'API error with list registry clients.' == str(exec_info.value)


# Test get_nifi_registry_client_in_nifi
def test_get_nifi_registry_client_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_list_in_nifi(self):
        return nipyapi.nifi.RegistryClientsEntity(
            registries = [
                nipyapi.nifi.RegistryClientEntity(
                    bulletins = None,
                    component = nipyapi.nifi.RegistryDTO(
                        description = '',
                        id = '8dba9e1b-017b-1000-0802-c1236649610f',
                        name = 'Nifi Registry - 1',
                        uri = 'https://localhost:18083'
                    ),
                    disconnected_node_acknowledged = None,
                    id = '8dba9e1b-017b-1000-0802-c1236649610f',
                    permissions = nipyapi.nifi.PermissionsDTO(
                        can_read = True, 
                        can_write = True
                    ),
                    position = None,
                    revision = nipyapi.nifi.RevisionDTO(
                        client_id = None,
                        last_modifier = None,
                        version = 1
                    ),
                    uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
                ), 
                nipyapi.nifi.RegistryClientEntity(
                    bulletins = None,
                    component = nipyapi.nifi.RegistryDTO(
                        description = '',
                        id = '999a9e1b-017b-1000-0802-c12366499999',
                        name = 'Nifi Registry - 2',
                        uri = 'https://localhost:28083'
                    ),
                    disconnected_node_acknowledged = None,
                    id = '999a9e1b-017b-1000-0802-c12366499999',
                    permissions = nipyapi.nifi.PermissionsDTO(
                        can_read = True, 
                        can_write = True
                    ),
                    position = None,
                    revision = nipyapi.nifi.RevisionDTO(
                        client_id = None,
                        last_modifier = None,
                        version = 1
                    ),
                    uri = 'https://localhost/nifi-api/controller/registry-clients/999a9e1b-017b-1000-0802-c12366499999'
                )
            ]
        )

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_list_in_nifi', mock_get_nifi_registry_client_list_in_nifi)

    # Act & Assert
    assert isinstance(Controller().get_nifi_registry_client_in_nifi('Nifi Registry - 1'), nipyapi.nifi.RegistryClientEntity)

def test_get_nifi_registry_client_in_nifi_missing_registry_client(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_list_in_nifi(self):
        return nipyapi.nifi.RegistryClientsEntity(
            registries = []
        )

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_list_in_nifi', mock_get_nifi_registry_client_list_in_nifi)

    # Act & Assert
    assert Controller().get_nifi_registry_client_in_nifi('Nifi Registry - 1') is None


# create_nifi_registry_client_in_nifi
def test_create_nifi_registry_client_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_create_registry_client(name, uri, description):
        return 'Created successfully'

    monkeypatch.setattr(nipyapi.versioning, 'create_registry_client', mock_nipyapi_versioning_create_registry_client)

    # Act & Assert
    assert Controller().create_nifi_registry_client_in_nifi('new_registry', 'http://localhost:18083', 'a new registry') is not None

def test_create_nifi_registry_client_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_create_registry_client(name, uri, description):
        raise ValueError('API error with create registry client.')

    monkeypatch.setattr(nipyapi.versioning, 'create_registry_client', mock_nipyapi_versioning_create_registry_client)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().create_nifi_registry_client_in_nifi('new_registry', 'http://localhost:18083', 'a new registry')
    
    # Assert
    assert 'API error with create registry client.' == str(exec_info.value)


# update_nifi_registry_client_name_in_nifi
def test_update_nifi_registry_client_name_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            return body

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act & Assert
    assert getattr(getattr(Controller().update_nifi_registry_client_name_in_nifi('Nifi Registry', 'New Registry'), 'component'), 'name') == 'New Registry'

def test_update_nifi_registry_client_name_in_nifi_with_missing_client_registry(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return None

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_name_in_nifi('Nifi Registry', 'New Registry')
    
    # Assert
    assert 'Registry client, Nifi Registry does not exist. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_name_in_nifi_with_same_nifi_registry_client_name_in_nifi(setup):
    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_name_in_nifi('Nifi Registry', 'Nifi Registry')

    # Assert
    assert 'Current registry client name, Nifi Registry and new registry client name, Nifi Registry are exactly the same. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_name_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            raise ValueError('API error with update registry client.')

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_name_in_nifi('Nifi Registry', 'New Registry')
    
    # Assert
    assert 'API error with update registry client.' == str(exec_info.value)


# update_nifi_registry_client_uri_in_nifi
def test_update_nifi_registry_client_uri_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            return body

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act & Assert
    assert getattr(getattr(Controller().update_nifi_registry_client_uri_in_nifi('Nifi Registry', 'New Uri'), 'component'), 'uri') == 'New Uri'

def test_update_nifi_registry_client_uri_in_nifi_with_missing_client_registry(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return None

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_uri_in_nifi('Nifi Registry', 'New Uri')
    
    # Assert
    assert 'Registry client, Nifi Registry does not exist. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_uri_in_nifi_with_same_nifi_registry_client_uri_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    
    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_uri_in_nifi('Nifi Registry', 'https://localhost:18083')

    # Assert
    assert 'Current registry client uri and new registry client uri, https://localhost:18083 are exactly the same. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_uri_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            raise ValueError('API error with update registry client.')

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_uri_in_nifi('Nifi Registry', 'New Uri')
    
    # Assert
    assert 'API error with update registry client.' == str(exec_info.value)


# update_nifi_registry_client_description_in_nifi
def test_update_nifi_registry_client_description_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            return body

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act & Assert
    assert getattr(getattr(Controller().update_nifi_registry_client_description_in_nifi('Nifi Registry', 'New Description'), 'component'), 'description') == 'New Description'

def test_update_nifi_registry_client_description_in_nifi_with_missing_client_registry(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return None

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_description_in_nifi('Nifi Registry', 'New Description')
    
    # Assert
    assert 'Registry client, Nifi Registry does not exist. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_description_in_nifi_with_same_nifi_registry_client_description_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = 'My first hello registry',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    
    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_description_in_nifi('Nifi Registry', 'My first hello registry')

    # Assert
    assert 'Current registry client description and new registry client description, My first hello registry are exactly the same. No action taken.' == str(exec_info.value)

def test_update_nifi_registry_client_description_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    class mock_nipyapi_nifi_ControllerApi():
        def update_registry_client(self, id, body):
            raise ValueError('API error with update registry client.')

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.nifi, 'ControllerApi', mock_nipyapi_nifi_ControllerApi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().update_nifi_registry_client_description_in_nifi('Nifi Registry', 'New Description')
    
    # Assert
    assert 'API error with update registry client.' == str(exec_info.value)


# remove_nifi_registry_client_in_nifi
def test_remove_nifi_registry_client_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    def mock_nipyapi_versioning_delete_registry_client(body):
        return body

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.versioning, 'delete_registry_client', mock_nipyapi_versioning_delete_registry_client)

    # Act & Assert
    assert Controller().remove_nifi_registry_client_in_nifi('Nifi Registry') is not None

def test_remove_nifi_registry_client_in_nifi_with_missing_registry_client(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return None
    
    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().remove_nifi_registry_client_in_nifi('Nifi Registry')
    
    # Assert
    assert 'Registry client, Nifi Registry does not exist. No action taken.' == str(exec_info.value)

def test_remove_nifi_registry_client_in_nifi_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_client_name):
        return nipyapi.nifi.RegistryClientEntity(
            bulletins = None,
            component = nipyapi.nifi.RegistryDTO(
                description = '',
                id = '8dba9e1b-017b-1000-0802-c1236649610f',
                name = 'Nifi Registry',
                uri = 'https://localhost:18083'
            ),
            disconnected_node_acknowledged = None,
            id = '8dba9e1b-017b-1000-0802-c1236649610f',
            permissions = nipyapi.nifi.PermissionsDTO(
                can_read = True, 
                can_write = True
            ),
            position = None,
            revision = nipyapi.nifi.RevisionDTO(
                client_id = None,
                last_modifier = None,
                version = 1
            ),
            uri = 'https://localhost/nifi-api/controller/registry-clients/8dba9e1b-017b-1000-0802-c1236649610f'
        )
    
    def mock_nipyapi_versioning_delete_registry_client(body):
        raise ValueError('API error with delete registry client.')

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(nipyapi.versioning, 'delete_registry_client', mock_nipyapi_versioning_delete_registry_client)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Controller().remove_nifi_registry_client_in_nifi('Nifi Registry')
    
    # Assert
    assert 'API error with delete registry client.' == str(exec_info.value)
