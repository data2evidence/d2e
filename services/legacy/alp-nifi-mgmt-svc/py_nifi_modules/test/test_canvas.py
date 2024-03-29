import pytest
import nipyapi

from libs.canvas import Canvas
from libs.versioning import Versioning
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

# Test get_nifi_canvas_root_process_group_id
def test_get_nifi_canvas_root_process_group_id(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_root_pg_id():
        return 'root-pg-id'

    monkeypatch.setattr(nipyapi.canvas, 'get_root_pg_id', mock_nipyapi_security_get_root_pg_id)

    # Act & Assert
    assert Canvas().get_nifi_canvas_root_process_group_id() is not None

def test_get_nifi_canvas_root_process_group_id_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_root_pg_id():
        raise ValueError('API error with get nifi canvas root process group id.')

    monkeypatch.setattr(nipyapi.canvas, 'get_root_pg_id', mock_nipyapi_security_get_root_pg_id)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().get_nifi_canvas_root_process_group_id()

    # Assert
    assert 'API error with get nifi canvas root process group id.' == str(exec_info.value)


# Test get_nifi_canvas_process_group_id
def test_get_nifi_canvas_process_group_id(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return nipyapi.nifi.ProcessGroupEntity(
            component = nipyapi.nifi.ProcessGroupDTO(
                id = '8ddf1529-017b-1000-67d4-863f460d7054', 
                name = 'custom-process-group'
            )
        )

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act & Assert
    assert Canvas().get_nifi_canvas_process_group_id('custom-process-group') is not None

def test_get_nifi_canvas_process_group_id_with_missing_process_group(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return None

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().get_nifi_canvas_process_group_id('custom-process-group')

    # Assert
    assert 'Process group, custom-process-group not found. No action taken.' == str(exec_info.value)

def test_get_nifi_canvas_process_group_id_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        raise ValueError('API error with get nifi canvas process group id.')

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().get_nifi_canvas_process_group_id('custom-process-group')

    # Assert
    assert 'API error with get nifi canvas process group id.' == str(exec_info.value)


# Test remove_process_group_from_nifi_canvas
def test_remove_process_group_from_nifi_canvas(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return nipyapi.nifi.ProcessGroupEntity(
            component = nipyapi.nifi.ProcessGroupDTO(
                id = '8ddf1529-017b-1000-67d4-863f460d7054', 
                name = 'custom-process-group'
            )
        )

    def mock_nipyapi_security_delete_process_group(process_group_name, force, refresh):
        return 'Process Group successfully deleted.'

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)
    monkeypatch.setattr(nipyapi.canvas, 'delete_process_group', mock_nipyapi_security_delete_process_group)

    # Act & Assert
    assert Canvas().remove_process_group_from_nifi_canvas('custom-process-group') is not None

def test_remove_process_group_from_nifi_canvas_with_missing_process_group(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return None

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().remove_process_group_from_nifi_canvas('custom-process-group')

    # Assert
    assert 'Process group, custom-process-group not found. No action taken.' == str(exec_info.value)

def test_remove_process_group_from_nifi_canvas_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        raise ValueError('API error with remove nifi canvas process group.')

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().remove_process_group_from_nifi_canvas('custom-process-group')

    # Assert
    assert 'API error with remove nifi canvas process group.' == str(exec_info.value)


# deploy_latest_version_flow_to_nifi_canvas
def test_deploy_latest_version_flow_to_nifi_canvas_with_root_process_group(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_name):
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

    def mock_get_nifi_registry_flow_in_bucket(self, bucket_name, flow_name):
        return nipyapi.registry.VersionedFlow(
            bucket_identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
            bucket_name = 'study-bucket',
            created_timestamp = 1629392300772,
            description = '',
            identifier = '19d28aa6-a6df-4864-9394-03954ad24464',
            link = nipyapi.registry.JaxbLink(
                href = 'buckets/93867421-ff7b-4192-bbed-f1fd48209cce/flows/19d28aa6-a6df-4864-9394-03954ad24464',
                params = { 'rel': 'self' }
            ),
            modified_timestamp = 1629392300772,
            name = 'StudyDataDonationAPI',
            permissions = nipyapi.registry.Permissions(
                can_read = True, 
                can_write = True, 
                can_delete = True
            ),
            revision = nipyapi.registry.RevisionInfo(
                client_id = None,
                last_modifier = None, 
                version = 0
            ),
            type = 'Flow',
            version_count = 30
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_nipyapi_versioning_deploy_flow_version(pg_id, canvas_location, bucket_identifier, flow_identifier, registry_id, version_count):
        return 'Deployed successfully'

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_in_bucket', mock_get_nifi_registry_flow_in_bucket)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id', mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(nipyapi.versioning, 'deploy_flow_version', mock_nipyapi_versioning_deploy_flow_version)

    # Act & Assert
    assert Canvas().deploy_latest_version_flow_to_nifi_canvas('Registry', 'study-bucket', 'Wearable', 'root', ('500', '500')) is not None

def test_deploy_latest_version_flow_to_nifi_canvas_with_custom_process_group(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_name):
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

    def mock_get_nifi_registry_flow_in_bucket(self, bucket_name, flow_name):
        return nipyapi.registry.VersionedFlow(
            bucket_identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
            bucket_name = 'study-bucket',
            created_timestamp = 1629392300772,
            description = '',
            identifier = '19d28aa6-a6df-4864-9394-03954ad24464',
            link = nipyapi.registry.JaxbLink(
                href = 'buckets/93867421-ff7b-4192-bbed-f1fd48209cce/flows/19d28aa6-a6df-4864-9394-03954ad24464',
                params = { 'rel': 'self' }
            ),
            modified_timestamp = 1629392300772,
            name = 'StudyDataDonationAPI',
            permissions = nipyapi.registry.Permissions(
                can_read = True, 
                can_write = True, 
                can_delete = True
            ),
            revision = nipyapi.registry.RevisionInfo(
                client_id = None,
                last_modifier = None, 
                version = 0
            ),
            type = 'Flow',
            version_count = 30
        )

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_versioning_deploy_flow_version(pg_id, canvas_location, bucket_identifier, flow_identifier, registry_id, version_count):
        return 'Deployed successfully'

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_in_bucket', mock_get_nifi_registry_flow_in_bucket)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id', mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.versioning, 'deploy_flow_version', mock_nipyapi_versioning_deploy_flow_version)

    # Act & Assert
    assert Canvas().deploy_latest_version_flow_to_nifi_canvas('Registry', 'study-bucket', 'Wearable', 'custom-process-group', ('500', '500')) is not None

def test_deploy_latest_version_flow_to_nifi_canvas_with_missing_registry_client(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_name):
        return None

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().deploy_latest_version_flow_to_nifi_canvas('Registry', 'study-bucket', 'Wearable', 'root', ('500', '500'))

    # Assert
    assert 'Registry client, Registry not found. No action taken.' == str(exec_info.value)

def test_deploy_latest_version_flow_to_nifi_canvas_with_missing_flow(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_name):
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

    def mock_get_nifi_registry_flow_in_bucket(self, bucket_name, flow_name):
        return None

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_in_bucket', mock_get_nifi_registry_flow_in_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().deploy_latest_version_flow_to_nifi_canvas('Registry', 'study-bucket', 'Wearable', 'root', ('500', '500'))

    # Assert
    assert 'Flow, Wearable not found in Nifi Registry study-bucket bucket. No action taken.' == str(exec_info.value)

def test_latest_version_flow_to_nifi_canvas_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_client_in_nifi(self, registry_name):
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

    def mock_get_nifi_registry_flow_in_bucket(self, bucket_name, flow_name):
        return nipyapi.registry.VersionedFlow(
            bucket_identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
            bucket_name = 'study-bucket',
            created_timestamp = 1629392300772,
            description = '',
            identifier = '19d28aa6-a6df-4864-9394-03954ad24464',
            link = nipyapi.registry.JaxbLink(
                href = 'buckets/93867421-ff7b-4192-bbed-f1fd48209cce/flows/19d28aa6-a6df-4864-9394-03954ad24464',
                params = { 'rel': 'self' }
            ),
            modified_timestamp = 1629392300772,
            name = 'StudyDataDonationAPI',
            permissions = nipyapi.registry.Permissions(
                can_read = True, 
                can_write = True, 
                can_delete = True
            ),
            revision = nipyapi.registry.RevisionInfo(
                client_id = None,
                last_modifier = None, 
                version = 0
            ),
            type = 'Flow',
            version_count = 30
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_nipyapi_versioning_deploy_flow_version(pg_id, canvas_location, bucket_identifier, flow_identifier, registry_id, version_count):
        raise ValueError('API error with deploy flow version.')

    monkeypatch.setattr(Controller, 'get_nifi_registry_client_in_nifi', mock_get_nifi_registry_client_in_nifi)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_in_bucket', mock_get_nifi_registry_flow_in_bucket)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id', mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(nipyapi.versioning, 'deploy_flow_version', mock_nipyapi_versioning_deploy_flow_version)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().deploy_latest_version_flow_to_nifi_canvas('Registry', 'study-bucket', 'Wearable', 'root', ('500', '500'))

    # Assert
    assert 'API error with deploy flow version.' == str(exec_info.value)


# Test update_flow_version_in_nifi_canvas
def test_update_flow_version_in_nifi_canvas(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return nipyapi.nifi.ProcessGroupEntity(
            component = nipyapi.nifi.ProcessGroupDTO(
                id = '8ddf1529-017b-1000-67d4-863f460d7054', 
                name = 'custom-process-group'
            )
        )

    def mock_nipyapi_versioning_update_flow_ver(process_group_obj, target_version):
        return 'Process Group flow version updated successfully.'

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)
    monkeypatch.setattr(nipyapi.versioning, 'update_flow_ver', mock_nipyapi_versioning_update_flow_ver)

    # Act & Assert
    assert Canvas().update_flow_version_in_nifi_canvas('custom-process-group', 10) is not None

def test_update_flow_version_in_nifi_canvas_with_missing_process_group(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        return None

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().update_flow_version_in_nifi_canvas('custom-process-group', 10)

    # Assert
    assert 'Process group, custom-process-group not found. No action taken.' == str(exec_info.value)

def test_update_flow_version_in_nifi_canvas_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_process_group(process_group_name, identifier_type, greedy):
        raise ValueError('API error with get nifi canvas process group id.')

    monkeypatch.setattr(nipyapi.canvas, 'get_process_group', mock_nipyapi_security_get_process_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Canvas().update_flow_version_in_nifi_canvas('custom-process-group', 10)

    # Assert
    assert 'API error with get nifi canvas process group id.' == str(exec_info.value)
