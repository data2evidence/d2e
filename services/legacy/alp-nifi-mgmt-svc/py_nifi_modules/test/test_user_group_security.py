import pytest
import nipyapi

from libs.canvas import Canvas
from libs.security import Security
from libs.versioning import Versioning
from utils.enum_types import Service
from utils.enum_types import NifiAccessPolicyResource
from utils.enum_types import NifiAccessPolicyAction
from utils.enum_types import NifiProcessGroupAccessPolicyResource
from utils.enum_types import NifiRegistryResourcePolicy
from utils.enum_types import NifiRegistryResourcePolicyAction


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('NIFI__BASE_URL', 'https://localhost/nifi-api')
    monkeypatch.setenv('NIFI__CA_CERT_PATH', './keys/LOCAL_NIFI_CA_CERT')
    monkeypatch.setenv('NIFI__CERT_PATH', './keys/LOCAL_NIFI_CLIENT_CERT')
    monkeypatch.setenv('NIFI__KEY_PATH', './keys/LOCAL_NIFI_CLIENT_KEY')
    monkeypatch.setenv('NIFI_REGISTRY__BASE_URL',
                       'https://localhost:18083/nifi-registry-api')
    monkeypatch.setenv('NIFI_REGISTRY__CA_CERT_PATH',
                       './keys/LOCAL_NIFI_REGISTRY_CA_CERT')
    monkeypatch.setenv('NIFI_REGISTRY__CERT_PATH',
                       './keys/LOCAL_NIFI_REGISTRY_CLIENT_CERT')
    monkeypatch.setenv('NIFI_REGISTRY__KEY_PATH',
                       './keys/LOCAL_NIFI_REGISTRY_CLIENT_KEY')

# Test get_user_groups


def test_get_user_groups_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_list_service_user_groups(service):
        return 'service_user_groups_list'

    monkeypatch.setattr(nipyapi.security, 'list_service_user_groups',
                        mock_nipyapi_security_list_service_user_groups)

    # Act & Assert
    assert Security().get_user_groups(Service.NIFI) is not None
    assert Security().get_user_groups(Service.NIFI_REGISTRY) is not None


def test_get_user_groups_with_invalid_service_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    invalid_service_values = [
        Service, 'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_service_value in invalid_service_values:
        with pytest.raises(ValueError) as exec_info:
            Security().get_user_groups(invalid_service_value)

    # Assert
    assert 'Value is not Enum type of Service' == str(exec_info.value)


# Test get_user_group
def test_get_user_group_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return 'service_user'

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act & Assert
    assert Security().get_user_group('nifi-user-group', Service.NIFI) is not None
    assert Security().get_user_group('registry-user-group',
                                     Service.NIFI_REGISTRY) is not None


def test_get_user_group_with_missing_user_group_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().get_user_group('nifi-user-group', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().get_user_group('registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'User group, nifi-user-group does not exist. No action taken.' == str(
        nifi_exec_info.value)
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        nifi_registry_exec_info.value)


def test_get_user_group_with_invalid_service_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    invalid_service_values = [
        Service, 'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_service_value in invalid_service_values:
        with pytest.raises(ValueError) as exec_info:
            Security().get_user('john', invalid_service_value)

    # Assert
    assert 'Value is not Enum type of Service' == str(exec_info.value)


# Test create_new_user_group
def test_create_new_user_group_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    def mock_nipyapi_security_create_service_user_group(user_group_identity, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'create_service_user_group',
                        mock_nipyapi_security_create_service_user_group)

    # Act & Assert
    assert isinstance(Security().create_new_user_group(
        'nifi-user-group', Service.NIFI), nipyapi.nifi.UserGroupEntity)


def test_create_new_user_group_in_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    def mock_nipyapi_security_create_service_user_group(user_group_identity, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'create_service_user_group',
                        mock_nipyapi_security_create_service_user_group)

    # Act & Assert
    assert isinstance(Security().create_new_user_group(
        'nifi-user-group', Service.NIFI_REGISTRY), nipyapi.registry.UserGroup)


def test_create_new_user_group_with_invalid_service_in_nifi_and_nifi_registry(setup):
    # Arrange
    invalid_service_values = [
        Service, 'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_service_value in invalid_service_values:
        with pytest.raises(ValueError) as exec_info:
            Security().create_new_user_group('nifi-user-group', invalid_service_value)

    # Assert
    assert 'Value is not Enum type of Service' == str(exec_info.value)


def test_create_new_user_group_that_already_exist_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='92a17f5f-017b-1000-901d-02f37199ef77',
            uri='https://localhost/nifi-api/tenants/users/92a17f5f-017b-1000-901d-02f37199ef77',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserDTO(
                access_policies=[],
                configurable=True,
                id='92a17f5f-017b-1000-901d-02f37199ef77',
                identity='john',
                parent_group_id=None,
                position=None,
                user_groups=[],
                versioned_component_id=None
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().create_new_user_group('nifi-user-group', Service.NIFI)

    # Assert
    assert 'User group, nifi-user-group already exist. No action taken.' == str(
        exec_info.value)


def test_create_new_user_group_that_already_exist_in_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().create_new_user_group('registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'User group, registry-user-group already exist. No action taken.' == str(
        exec_info.value)


def test_create_new_user_group_with_api_error_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().create_new_user_group('nifi-user-group', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().create_new_user_group('registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'API error with get service user group.' == str(
        nifi_exec_info.value)
    assert 'API error with get service user group.' == str(
        nifi_registry_exec_info.value)


# Test update_user_group_identity
def test_update_user_group_identity_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    class mock_nipyapi_nifi_TenantsApi():
        def update_user_group(self, id, body):
            return nipyapi.nifi.UserGroupEntity(
                revision=nipyapi.nifi.RevisionDTO(
                    client_id=None,
                    last_modifier='CN=alice@email.com, OU=NIFI',
                    version=0
                ),
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                position=None,
                permissions=nipyapi.nifi.PermissionsDTO(
                    can_read=True,
                    can_write=True
                ),
                bulletins=None,
                disconnected_node_acknowledged=None,
                component=nipyapi.nifi.UserGroupDTO(
                    access_policies=[],
                    configurable=True,
                    id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                    identity='new-nifi-user-group',
                    parent_group_id=None,
                    position=None,
                    users=[],
                    versioned_component_id=None
                )
            )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.nifi, 'TenantsApi',
                        mock_nipyapi_nifi_TenantsApi)

    # Act & Assert
    assert isinstance(Security().update_user_group_identity(
        'nifi-user-group', 'new-nifi-user-group', Service.NIFI), nipyapi.nifi.UserGroupEntity)


def test_update_user_group_identity_in_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    class mock_nipyapi_registry_TenantsApi():
        def update_user_group(self, id, body):
            return nipyapi.registry.UserGroup(
                identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
                identity='new-registry-user-group',
                configurable=True,
                resource_permissions=nipyapi.registry.ResourcePermissions(
                    buckets=nipyapi.registry.Permissions(
                        can_read=False, can_write=False, can_delete=False),
                    tenants=nipyapi.registry.Permissions(
                        can_read=False, can_write=False, can_delete=False),
                    policies=nipyapi.registry.Permissions(
                        can_read=False, can_write=False, can_delete=False),
                    proxy=nipyapi.registry.Permissions(
                        can_read=False, can_write=False, can_delete=False),
                    any_top_level_resource=nipyapi.registry.Permissions(
                        can_read=False, can_write=False, can_delete=False)
                ),
                access_policies=[],
                revision=nipyapi.registry.RevisionInfo(
                    client_id=None,
                    last_modifier=None,
                    version=0
                ),
                users=[]
            )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.registry, 'TenantsApi',
                        mock_nipyapi_registry_TenantsApi)

    # Act & Assert
    assert isinstance(Security().update_user_group_identity('registry-user-group',
                      'new-registry-user-group', Service.NIFI_REGISTRY), nipyapi.registry.UserGroup)


def test_update_user_group_identity_with_same_user_identity_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().update_user_group_identity(
            'nifi-user-group', 'nifi-user-group', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().update_user_group_identity('registry-user-group',
                                              'registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'Current user group identity, nifi-user-group and new user group identity, nifi-user-group are exactly the same. No action taken.' == str(
        nifi_exec_info.value)
    assert 'Current user group identity, registry-user-group and new user group identity, registry-user-group are exactly the same. No action taken.' == str(
        nifi_registry_exec_info.value)


def test_update_user_group_identity_with_invalid_service_in_nifi_and_nifi_registry(setup):
    # Arrange
    invalid_service_values = [
        Service, 'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_service_value in invalid_service_values:
        with pytest.raises(ValueError) as exec_info:
            Security().update_user_group_identity('registry-user-group',
                                                  'new-registry-user-group', invalid_service_value)

    # Assert
    assert 'Value is not Enum type of Service' == str(exec_info.value)


def test_update_user_group_identity_that_do_not_exist_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().update_user_group_identity(
            'nifi-user-group', 'new-nifi-user-groupary', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().update_user_group_identity('registry-user-group',
                                              'new-registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'User group, nifi-user-group does not exist. No action taken.' == str(
        nifi_exec_info.value)
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        nifi_registry_exec_info.value)


def test_update_user_group_identity_with_api_error_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().update_user_group_identity('registry-user-group',
                                              'mnew-registry-user-groupary', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().update_user_group_identity('registry-user-group',
                                              'new-registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'API error with get service user group.' == str(
        nifi_exec_info.value)
    assert 'API error with get service user group.' == str(
        nifi_registry_exec_info.value)


# Test add_user_group_to_nifi_access_policy
def test_add_user_group_to_nifi_access_policy_with_no_existing_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_controller_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)
    response_policies_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)
    response_tenants_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.READ)
    response_counters_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.READ)

    response_controller_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)
    response_tenants_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.WRITE)
    response_counters_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_controller_read, 'component'),
                   'resource') == '/controller'
    assert getattr(getattr(response_controller_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_tenants_read, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_counters_read, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_read,
                   'component'), 'action') == 'read'

    assert getattr(getattr(response_controller_write,
                   'component'), 'resource') == '/controller'
    assert getattr(getattr(response_controller_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_tenants_write, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_counters_write, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_write,
                   'component'), 'action') == 'write'


def test_add_user_group_to_nifi_access_policy_with_existing_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_controller_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)
    response_policies_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)
    response_tenants_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.READ)
    response_counters_read = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.READ)

    response_controller_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)
    response_tenants_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.WRITE)
    response_counters_write = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_controller_read, 'component'),
                   'resource') == '/controller'
    assert getattr(getattr(response_controller_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_tenants_read, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_counters_read, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_read,
                   'component'), 'action') == 'read'

    assert getattr(getattr(response_controller_write,
                   'component'), 'resource') == '/controller'
    assert getattr(getattr(response_controller_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_tenants_write, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_counters_write, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_write,
                   'component'), 'action') == 'write'


def test_add_user_group_to_nifi_access_policy_with_read_only_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_flow = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.FLOW, NifiAccessPolicyAction.WRITE)
    response_provenance = Security().add_user_group_to_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.PROVENANCE, NifiAccessPolicyAction.WRITE)
    response_system = Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                                      NifiAccessPolicyResource.SYSTEM_DIAGNOSTICS, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_flow, 'component'), 'resource') == '/flow'
    assert getattr(getattr(response_flow, 'component'), 'action') == 'read'
    assert getattr(getattr(response_provenance, 'component'),
                   'resource') == '/provenance'
    assert getattr(getattr(response_provenance, 'component'),
                   'action') == 'read'
    assert getattr(getattr(response_system, 'component'),
                   'resource') == '/system'
    assert getattr(getattr(response_system, 'component'), 'action') == 'read'


def test_add_user_group_to_nifi_access_policy_with_write_only_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_proxy = Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                                     NifiAccessPolicyResource.PROXY_USER_REQUESTS, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response_proxy, 'component'),
                   'resource') == '/proxy'
    assert getattr(getattr(response_proxy, 'component'), 'action') == 'write'


def test_add_user_group_to_nifi_access_policy_with_user_group_already_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users/92a17f5f-017b-1000-901d-02f37199ef77',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                        NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group already in read access policy, /controller. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_access_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiAccessPolicyResource,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                            invalid_resource_value, NifiAccessPolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyResource' == str(
        exec_info.value)


def test_add_user_group_to_nifi_access_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiAccessPolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                            NifiAccessPolicyResource.CONTROLLER, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyAction' == str(
        exec_info.value)


def test_add_user_group_to_nifi_access_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                        NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not exist in nifi. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_access_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_access_policy('nifi-user-group',
                                                        NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)


# Test add_user_group_to_nifi_process_group_access_policy
def test_add_user_group_to_nifi_process_group_access_policy_with_no_existing_root_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_component_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)
    response_data_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.READ)
    response_policies_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)

    response_component_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.WRITE)
    response_data_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_component_read, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_data_read, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_read, 'component'),
                   'action') == 'read'
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'

    assert getattr(getattr(response_component_write, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_data_write, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_write, 'component'),
                   'action') == 'write'
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'


def test_add_user_group_to_nifi_process_group_access_policy_with_existing_root_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_component_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)
    response_data_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.READ)
    response_policies_read = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)

    response_component_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.WRITE)
    response_data_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().add_user_group_to_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_component_read, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_read,
                   'component'), 'action') == 'read'
    assert getattr(getattr(response_data_read, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_read, 'component'),
                   'action') == 'read'
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'

    assert getattr(getattr(response_component_write, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_write,
                   'component'), 'action') == 'write'
    assert getattr(getattr(response_data_write, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_write, 'component'),
                   'action') == 'write'
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'


def test_add_user_group_to_nifi_process_group_access_policy_with_existing_custom_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response = Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                             'custom-dataflow', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/process-groups/non-root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'read'


def test_add_user_group_to_nifi_process_group_access_policy_with_read_only_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response = Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                             'root', NifiProcessGroupAccessPolicyResource.VIEW_PROVENANCE, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/provenance-data/process-groups/root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'read'


def test_add_user_group_to_nifi_process_group_access_policy_with_write_only_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_add_user_group_to_access_policy(user_group_obj, access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response = Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                             'root', NifiProcessGroupAccessPolicyResource.OPERATION_COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/operation/process-groups/root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'write'


def test_add_user_group_to_nifi_process_group_access_policy_with_user_group_already_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users/92a17f5f-017b-1000-901d-02f37199ef77',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                      'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group already in read process group access policy, /process-groups. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_process_group_access_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiProcessGroupAccessPolicyResource,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_process_group_access_policy(
                'nifi-user-group', 'root', invalid_resource_value, NifiAccessPolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiProcessGroupAccessPolicyResource' == str(
        exec_info.value)


def test_add_user_group_to_nifi_process_group_access_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiAccessPolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                          'root',  NifiProcessGroupAccessPolicyResource.COMPONENT, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyAction' == str(
        exec_info.value)


def test_add_user_group_to_nifi_process_group_access_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                      'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_process_group_access_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_process_group_access_policy('nifi-user-group',
                                                                      'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)


# Test add_user_group_to_nifi_registry_resource_policy
def test_add_user_group_to_nifi_registry_resource_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[]
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_obj, resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_buckets_read = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)
    response_tenants_read = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                       NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.READ)
    response_policies_read = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.READ)
    response_proxy_read = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                     NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.READ)

    response_buckets_write = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.WRITE)
    response_tenants_write = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                        NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.WRITE)
    response_policies_write = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.WRITE)
    response_proxy_write = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                      NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.WRITE)

    response_buckets_delete = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.DELETE)
    response_tenants_delete = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                         NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.DELETE)
    response_policies_delete = Security().add_user_group_to_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.DELETE)
    response_proxy_delete = Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                                       NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.DELETE)

    # Assert
    assert getattr(response_buckets_read, 'resource') == '/buckets'
    assert getattr(response_buckets_read, 'action') == 'read'
    assert getattr(response_tenants_read, 'resource') == '/tenants'
    assert getattr(response_tenants_read, 'action') == 'read'
    assert getattr(response_policies_read, 'resource') == '/policies'
    assert getattr(response_policies_read, 'action') == 'read'
    assert getattr(response_proxy_read, 'resource') == '/proxy'
    assert getattr(response_proxy_read, 'action') == 'read'

    assert getattr(response_buckets_write, 'resource') == '/buckets'
    assert getattr(response_buckets_write, 'action') == 'write'
    assert getattr(response_tenants_write, 'resource') == '/tenants'
    assert getattr(response_tenants_write, 'action') == 'write'
    assert getattr(response_policies_write, 'resource') == '/policies'
    assert getattr(response_policies_write, 'action') == 'write'
    assert getattr(response_proxy_write, 'resource') == '/proxy'
    assert getattr(response_proxy_write, 'action') == 'write'

    assert getattr(response_buckets_delete, 'resource') == '/buckets'
    assert getattr(response_buckets_delete, 'action') == 'delete'
    assert getattr(response_tenants_delete, 'resource') == '/tenants'
    assert getattr(response_tenants_delete, 'action') == 'delete'
    assert getattr(response_policies_delete, 'resource') == '/policies'
    assert getattr(response_policies_delete, 'action') == 'delete'
    assert getattr(response_proxy_delete, 'resource') == '/proxy'
    assert getattr(response_proxy_delete, 'action') == 'delete'


def test_add_user_group_to_nifi_registry_resource_policy_with_user_group_already_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[
                nipyapi.registry.Tenant(
                    identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
                    identity='registry-user-group',
                    configurable=True,
                    resource_permissions=nipyapi.registry.ResourcePermissions(
                        buckets=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        tenants=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        policies=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        proxy=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        any_top_level_resource=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False)
                    ),
                    access_policies=[],
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier='CN=alice@email.com, OU=NIFI',
                        version=0
                    )
                )
            ]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                   NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group already in read resource policy, /buckets. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_resource_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiRegistryResourcePolicy,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                       invalid_resource_value, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicy' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_resource_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiRegistryResourcePolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_registry_resource_policy(
                'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicyAction' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_resource_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                   NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_resource_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_identity, identifier_type, service):
        raise ValueError('API error with get service user.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                   NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'API error with get service user.' == str(exec_info.value)


# Test add_user_group_to_nifi_registry_bucket_policy
def test_add_user_group_to_nifi_registry_bucket_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return nipyapi.registry.Bucket(
            link=nipyapi.registry.JaxbLink(
                href='/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params={'rel': 'self'}
            ),
            identifier='93867421-ff7b-4192-bbed-f1fd48209cce',
            name='study-bucket',
            created_timestamp=1629392300771,
            description=None,
            allow_bundle_redeploy=False,
            allow_public_read=False,
            permissions=nipyapi.registry.Permissions(
                can_read=True,
                can_write=True,
                can_delete=True
            ),
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='67825475-ae32-4934-90b1-e77e7f1ecb73',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[]
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_obj, resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_buckets_read = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)
    response_buckets_write = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.WRITE)
    response_buckets_delete = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.DELETE)

    # Assert
    assert getattr(response_buckets_read,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_read, 'action') == 'read'
    assert getattr(response_buckets_write,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_write, 'action') == 'write'
    assert getattr(response_buckets_delete,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_delete, 'action') == 'delete'


def test_add_user_group_to_nifi_registry_bucket_policy_with_no_existing_bucket_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return nipyapi.registry.Bucket(
            link=nipyapi.registry.JaxbLink(
                href='/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params={'rel': 'self'}
            ),
            identifier='93867421-ff7b-4192-bbed-f1fd48209cce',
            name='study-bucket',
            created_timestamp=1629392300771,
            description=None,
            allow_bundle_redeploy=False,
            allow_public_read=False,
            permissions=nipyapi.registry.Permissions(
                can_read=True,
                can_write=True,
                can_delete=True
            ),
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        raise ValueError('Missing access policy for bucket')

    def mock_nipyapi_security_create_access_policy(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='67825475-ae32-4934-90b1-e77e7f1ecb73',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[]
        )

    def mock_nipyapi_security_add_user_group_to_access_policy(user_obj, resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'create_access_policy',
                        mock_nipyapi_security_create_access_policy)
    monkeypatch.setattr(nipyapi.security, 'add_user_group_to_access_policy',
                        mock_nipyapi_security_add_user_group_to_access_policy)

    # Act
    response_buckets_read = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)
    response_buckets_write = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.WRITE)
    response_buckets_delete = Security().add_user_group_to_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.DELETE)

    # Assert
    assert getattr(response_buckets_read,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_read, 'action') == 'read'
    assert getattr(response_buckets_write,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_write, 'action') == 'write'
    assert getattr(response_buckets_delete,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_delete, 'action') == 'delete'


def test_add_user_group_to_nifi_registry_bucket_policy_with_user_group_already_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[
                nipyapi.registry.Tenant(
                    identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
                    identity='registry-user-group',
                    configurable=True,
                    resource_permissions=nipyapi.registry.ResourcePermissions(
                        buckets=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        tenants=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        policies=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        proxy=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        any_top_level_resource=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False)
                    ),
                    access_policies=[],
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier='CN=alice@email.com, OU=NIFI',
                        version=0
                    )
                )
            ]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_resource_policy('registry-user-group',
                                                                   NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group already in read resource policy, /buckets. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_bucket_policy_with_missing_bucket(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user',
                        mock_nipyapi_security_get_service_user)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_to_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'Bucket, study-bucket not found. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_bucket_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiRegistryResourcePolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().add_user_group_to_nifi_registry_bucket_policy(
                'registry-user-group', 'study-bucket', invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicyAction' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_bucket_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_add_user_group_to_nifi_registry_bucket_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_identity, identifier_type, service):
        raise ValueError('API error with get service user.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().add_user_group_to_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'API error with get service user.' == str(exec_info.value)


# Test remove_user_group
def test_remove_user_group_in_nifi(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return 'UserGroupEntity'

    def mock_nipyapi_security_remove_service_user_group(user_group_identity, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'remove_service_user_group',
                        mock_nipyapi_security_remove_service_user_group)

    # Act & Assert
    assert isinstance(Security().remove_user_group(
        'nifi-user-group', Service.NIFI_REGISTRY), nipyapi.nifi.UserGroupEntity)


def test_remove_user_group_in_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return 'User'

    def mock_nipyapi_security_remove_service_user_group(user_group_identity, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'remove_service_user_group',
                        mock_nipyapi_security_remove_service_user_group)

    # Act & Assert
    assert isinstance(Security().remove_user_group(
        'registry-user-group', Service.NIFI_REGISTRY), nipyapi.registry.UserGroup)


def test_remove_user_group_with_invalid_service_in_nifi_and_nifi_registry(setup):
    # Arrange
    invalid_service_values = [
        Service, 'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_service_value in invalid_service_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group('nifi-user-group', invalid_service_value)

    # Assert
    assert 'Value is not Enum type of Service' == str(exec_info.value)


def test_remove_user_group_with_missing_user_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().remove_user_group('nifi-user-group', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().remove_user_group('registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert f'User group, nifi-user-group does not exist. No action taken.' == str(
        nifi_exec_info.value)
    assert f'User group, registry-user-group does not exist. No action taken.' == str(
        nifi_registry_exec_info.value)


def test_remove_user_group_with_api_error_in_nifi_and_nifi_registry(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as nifi_exec_info:
        Security().remove_user_group('nifi-user-group', Service.NIFI)

    with pytest.raises(ValueError) as nifi_registry_exec_info:
        Security().remove_user_group('registry-user-group', Service.NIFI_REGISTRY)

    # Assert
    assert 'API error with get service user group.' == str(
        nifi_exec_info.value)
    assert 'API error with get service user group.' == str(
        nifi_registry_exec_info.value)


# Test remove_user_group_from_nifi_access_policy
def test_remove_user_group_from_nifi_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_controller_read = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)
    response_policies_read = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)
    response_tenants_read = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.READ)
    response_counters_read = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.READ)

    response_controller_write = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)
    response_tenants_write = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.USER_AND_USER_GROUP, NifiAccessPolicyAction.WRITE)
    response_counters_write = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.ACCESS_COUNTERS, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_controller_read, 'component'),
                   'resource') == '/controller'
    assert getattr(getattr(response_controller_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_controller_read,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_policies_read,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_tenants_read, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_tenants_read,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_counters_read, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_counters_read,
               'component'), 'user_groups')) == 0

    assert getattr(getattr(response_controller_write,
                   'component'), 'resource') == '/controller'
    assert getattr(getattr(response_controller_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_controller_write,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_policies_write,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_tenants_write, 'component'),
                   'resource') == '/tenants'
    assert getattr(getattr(response_tenants_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_tenants_write,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_counters_write, 'component'),
                   'resource') == '/counters'
    assert getattr(getattr(response_counters_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_counters_write,
               'component'), 'user_groups')) == 0


def test_remove_user_group_from_nifi_access_policy_with_read_only_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_flow = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.FLOW, NifiAccessPolicyAction.WRITE)
    response_provenance = Security().remove_user_group_from_nifi_access_policy(
        'nifi-user-group', NifiAccessPolicyResource.PROVENANCE, NifiAccessPolicyAction.WRITE)
    response_system = Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                                           NifiAccessPolicyResource.SYSTEM_DIAGNOSTICS, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_flow, 'component'), 'resource') == '/flow'
    assert getattr(getattr(response_flow, 'component'), 'action') == 'read'
    assert len(getattr(getattr(response_flow, 'component'), 'user_groups')) == 0
    assert getattr(getattr(response_provenance, 'component'),
                   'resource') == '/provenance'
    assert getattr(getattr(response_provenance, 'component'),
                   'action') == 'read'
    assert len(getattr(getattr(response_provenance,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_system, 'component'),
                   'resource') == '/system'
    assert getattr(getattr(response_system, 'component'), 'action') == 'read'
    assert len(getattr(getattr(response_system, 'component'), 'user_groups')) == 0


def test_remove_user_group_from_nifi_access_policy_with_write_only_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_proxy = Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                                          NifiAccessPolicyResource.PROXY_USER_REQUESTS, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response_proxy, 'component'),
                   'resource') == '/proxy'
    assert getattr(getattr(response_proxy, 'component'), 'action') == 'write'
    assert len(getattr(getattr(response_proxy, 'component'), 'user_groups')) == 0


def test_remove_user_group_from_nifi_access_policy_with_user_not_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                             NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not belong to read access policy, /controller. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_access_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiAccessPolicyResource,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_access_policy(
                'nifi-user-group', invalid_resource_value, NifiAccessPolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyResource' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_access_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiAccessPolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                                 NifiAccessPolicyResource.CONTROLLER, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyAction' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_access_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                             NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_access_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_access_policy('nifi-user-group',
                                                             NifiAccessPolicyResource.CONTROLLER, NifiAccessPolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)


# Test remove_user_group_from_nifi_process_group_access_policy
def test_remove_user_from_nifi_process_group_access_policy_with_root_process_group(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_component_read = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)
    response_data_read = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.READ)
    response_policies_read = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.READ)

    response_component_write = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.WRITE)
    response_data_write = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.DATA, NifiAccessPolicyAction.WRITE)
    response_policies_write = Security().remove_user_group_from_nifi_process_group_access_policy(
        'nifi-user-group', 'root', NifiProcessGroupAccessPolicyResource.POLICIES, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response_component_read, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_component_read,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_data_read, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_read, 'component'),
                   'action') == 'read'
    assert len(getattr(getattr(response_data_read,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_policies_read, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_read,
                   'component'), 'action') == 'read'
    assert len(getattr(getattr(response_policies_read,
               'component'), 'user_groups')) == 0

    assert getattr(getattr(response_component_write, 'component'),
                   'resource') == '/process-groups/root-pg-id'
    assert getattr(getattr(response_component_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_component_write,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_data_write, 'component'),
                   'resource') == '/data/process-groups/root-pg-id'
    assert getattr(getattr(response_data_write, 'component'),
                   'action') == 'write'
    assert len(getattr(getattr(response_data_write,
               'component'), 'user_groups')) == 0
    assert getattr(getattr(response_policies_write, 'component'),
                   'resource') == '/policies/process-groups/root-pg-id'
    assert getattr(getattr(response_policies_write,
                   'component'), 'action') == 'write'
    assert len(getattr(getattr(response_policies_write,
               'component'), 'user_groups')) == 0


def test_remove_user_from_nifi_process_group_access_policy_with_custom_process_group(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response = Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                                  'custom-dataflow', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/process-groups/non-root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'read'
    assert len(getattr(getattr(response, 'component'), 'user_groups')) == 0


def test_remove_user_from_nifi_process_group_access_policy_with_read_only_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response = Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                                  'root', NifiProcessGroupAccessPolicyResource.VIEW_PROVENANCE, NifiAccessPolicyAction.WRITE)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/provenance-data/process-groups/root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'read'
    assert len(getattr(getattr(response, 'component'), 'user_groups')) == 0


def test_remove_user_from_nifi_process_group_access_policy_with_write_only_process_group_access_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[
                    nipyapi.nifi.AccessPolicySummaryEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='979da4c4-017b-1000-1367-acfdeca7421c',
                        uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component='AccessPolicySummaryDTO'
                    )
                ],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=f'{resource_value}/{resource_id}',
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[
                    nipyapi.nifi.TenantEntity(
                        revision=nipyapi.nifi.RevisionDTO(
                            client_id=None,
                            last_modifier='CN=alice@email.com, OU=NIFI',
                            version=0
                        ),
                        id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                        position=None,
                        permissions=nipyapi.nifi.PermissionsDTO(
                            can_read=True,
                            can_write=True
                        ),
                        bulletins=None,
                        disconnected_node_acknowledged=None,
                        component=nipyapi.nifi.TenantDTO(
                            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                            versioned_component_id=None,
                            parent_group_id=None,
                            position=None,
                            identity='nifi-user-group',
                            configurable=True
                        )
                    )
                ]
            )
        )

    def mock_nipyapi_security_update_access_policy(access_policy, service):
        return access_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response = Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                                  'root', NifiProcessGroupAccessPolicyResource.OPERATION_COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert getattr(getattr(response, 'component'),
                   'resource') == '/operation/process-groups/root-pg-id'
    assert getattr(getattr(response, 'component'), 'action') == 'write'
    assert len(getattr(getattr(response, 'component'), 'user_groups')) == 0


def test_remove_user_from_nifi_process_group_access_policy_with_user_not_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.nifi.UserGroupEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            uri='https://localhost/nifi-api/tenants/users-groups/9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            component=nipyapi.nifi.UserGroupDTO(
                access_policies=[],
                configurable=True,
                id='9ebf9eb84-b38a-4801-ad87-69aaab611ac7',
                identity='nifi-user-group',
                parent_group_id=None,
                position=None,
                users=[],
                versioned_component_id=None
            )
        )

    def mock_get_nifi_canvas_root_process_group_id(self):
        return 'root-pg-id'

    def mock_get_nifi_canvas_process_group_id(self, process_group_name):
        return 'non-root-pg-id'

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.nifi.AccessPolicyEntity(
            revision=nipyapi.nifi.RevisionDTO(
                client_id=None,
                last_modifier='CN=alice@email.com, OU=NIFI',
                version=0
            ),
            id='979da4c4-017b-1000-1367-acfdeca7421c',
            uri='https://localhost/nifi-api/policies/979da4c4-017b-1000-1367-acfdeca7421c',
            position=None,
            permissions=nipyapi.nifi.PermissionsDTO(
                can_read=True,
                can_write=True
            ),
            bulletins=None,
            disconnected_node_acknowledged=None,
            generated='23:12:09 SGT',
            component=nipyapi.nifi.AccessPolicyDTO(
                id='979da4c4-017b-1000-1367-acfdeca7421c',
                versioned_component_id=None,
                parent_group_id=None,
                position=None,
                resource=resource_value,
                action=action_value,
                component_reference=None,
                configurable=True,
                users=[],
                user_groups=[]
            )
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_root_process_group_id',
                        mock_get_nifi_canvas_root_process_group_id)
    monkeypatch.setattr(Canvas, 'get_nifi_canvas_process_group_id',
                        mock_get_nifi_canvas_process_group_id)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group', 'root',
                                                                           NifiProcessGroupAccessPolicyResource.OPERATION_COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not belong to read access policy, /operation/process-groups. No action taken.' == str(
        exec_info.value)


def test_remove_user_from_nifi_process_group_access_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiProcessGroupAccessPolicyResource,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_process_group_access_policy(
                'nifi-user-group', 'root', invalid_resource_value, NifiAccessPolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiProcessGroupAccessPolicyResource' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_process_group_access_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiAccessPolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                               'root',  NifiProcessGroupAccessPolicyResource.COMPONENT, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiAccessPolicyAction' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_process_group_access_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                           'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'User group, nifi-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_process_group_access_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_process_group_access_policy('nifi-user-group',
                                                                           'root', NifiProcessGroupAccessPolicyResource.COMPONENT, NifiAccessPolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)


# Test remove_user_group_from_nifi_registry_resource_policy
def test_remove_user_group_from_nifi_registry_resource_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[
                nipyapi.registry.AccessPolicySummary(
                    identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
                    resource='/registry-resource',
                    action='read',
                    configurable=True,
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier=None,
                        version=0
                    )
                )
            ],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[
                nipyapi.registry.Tenant(
                    identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
                    identity='registry-user-group',
                    configurable=True,
                    resource_permissions=nipyapi.registry.ResourcePermissions(
                        buckets=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        tenants=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        policies=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        proxy=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        any_top_level_resource=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False)
                    ),
                    access_policies=[],
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier='CN=alice@email.com, OU=NIFI',
                        version=0
                    )
                )
            ]
        )

    def mock_nipyapi_security_update_access_policy(resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_buckets_read = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)
    response_tenants_read = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.READ)
    response_policies_read = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.READ)
    response_proxy_read = Security().remove_user_group_from_nifi_registry_resource_policy('registry-user-group',
                                                                                          NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.READ)

    response_buckets_write = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.WRITE)
    response_tenants_write = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.WRITE)
    response_policies_write = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.WRITE)
    response_proxy_write = Security().remove_user_group_from_nifi_registry_resource_policy('registry-user-group',
                                                                                           NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.WRITE)

    response_buckets_delete = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.DELETE)
    response_tenants_delete = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.USER_AND_USER_GROUP, NifiRegistryResourcePolicyAction.DELETE)
    response_policies_delete = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.POLICIES, NifiRegistryResourcePolicyAction.DELETE)
    response_proxy_delete = Security().remove_user_group_from_nifi_registry_resource_policy(
        'registry-user-group', NifiRegistryResourcePolicy.PROXY_USER_REQUESTS, NifiRegistryResourcePolicyAction.DELETE)

    # Assert
    assert getattr(response_buckets_read, 'resource') == '/buckets'
    assert getattr(response_buckets_read, 'action') == 'read'
    assert len(getattr(response_buckets_read, 'user_groups')) == 0
    assert getattr(response_tenants_read, 'resource') == '/tenants'
    assert getattr(response_tenants_read, 'action') == 'read'
    assert len(getattr(response_tenants_read, 'user_groups')) == 0
    assert getattr(response_policies_read, 'resource') == '/policies'
    assert getattr(response_policies_read, 'action') == 'read'
    assert len(getattr(response_policies_read, 'user_groups')) == 0
    assert getattr(response_proxy_read, 'resource') == '/proxy'
    assert getattr(response_proxy_read, 'action') == 'read'
    assert len(getattr(response_proxy_read, 'user_groups')) == 0

    assert getattr(response_buckets_write, 'resource') == '/buckets'
    assert getattr(response_buckets_write, 'action') == 'write'
    assert len(getattr(response_buckets_write, 'user_groups')) == 0
    assert getattr(response_tenants_write, 'resource') == '/tenants'
    assert getattr(response_tenants_write, 'action') == 'write'
    assert len(getattr(response_tenants_write, 'user_groups')) == 0
    assert getattr(response_policies_write, 'resource') == '/policies'
    assert getattr(response_policies_write, 'action') == 'write'
    assert len(getattr(response_policies_write, 'user_groups')) == 0
    assert getattr(response_proxy_write, 'resource') == '/proxy'
    assert getattr(response_proxy_write, 'action') == 'write'
    assert len(getattr(response_proxy_write, 'user_groups')) == 0

    assert getattr(response_buckets_delete, 'resource') == '/buckets'
    assert getattr(response_buckets_delete, 'action') == 'delete'
    assert len(getattr(response_buckets_delete, 'user_groups')) == 0
    assert getattr(response_tenants_delete, 'resource') == '/tenants'
    assert getattr(response_tenants_delete, 'action') == 'delete'
    assert len(getattr(response_tenants_delete, 'user_groups')) == 0
    assert getattr(response_policies_delete, 'resource') == '/policies'
    assert getattr(response_policies_delete, 'action') == 'delete'
    assert len(getattr(response_policies_delete, 'user_groups')) == 0
    assert getattr(response_proxy_delete, 'resource') == '/proxy'
    assert getattr(response_proxy_delete, 'action') == 'delete'
    assert len(getattr(response_proxy_delete, 'user_groups')) == 0


def test_remove_user_group_from_nifi_registry_resource_policy_with_user_group_not_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='ff96062a-fa99-36dc-9942-0f6442ae7212',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_resource_policy('registry-user-group',
                                                                        NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not belong to read resource policy, /buckets. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_resource_policy_with_invalid_resource(setup):
    # Arrange
    invalid_resource_values = [NifiRegistryResourcePolicy,
                               'random_invalid_string', 123, NifiAccessPolicyAction.READ]

    # Act
    for invalid_resource_value in invalid_resource_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_registry_resource_policy(
                'registry-user-group', invalid_resource_value, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicy' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_resource_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiRegistryResourcePolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_registry_resource_policy(
                'registry-user-group', NifiRegistryResourcePolicy.BUCKETS, invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicyAction' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_resource_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_resource_policy('registry-user-group',
                                                                        NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_resource_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_resource_policy('registry-user-group',
                                                                        NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)


# remove_user_group_from_nifi_registry_bucket_policy
def test_remove_user_from_nifi_registry_bucket_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[
                nipyapi.registry.AccessPolicySummary(
                    identifier='67825475-ae32-4934-90b1-e77e7f1ecb73',
                    resource='registry-bucket-resource',
                    action='read',
                    configurable=True,
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier=None,
                        version=0
                    )
                )
            ],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return nipyapi.registry.Bucket(
            link=nipyapi.registry.JaxbLink(
                href='/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params={'rel': 'self'}
            ),
            identifier='93867421-ff7b-4192-bbed-f1fd48209cce',
            name='study-bucket',
            created_timestamp=1629392300771,
            description=None,
            allow_bundle_redeploy=False,
            allow_public_read=False,
            permissions=nipyapi.registry.Permissions(
                can_read=True,
                can_write=True,
                can_delete=True
            ),
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='67825475-ae32-4934-90b1-e77e7f1ecb73',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[
                nipyapi.registry.Tenant(
                    identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
                    identity='registry-user-group',
                    configurable=True,
                    resource_permissions=nipyapi.registry.ResourcePermissions(
                        buckets=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        tenants=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        policies=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        proxy=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False),
                        any_top_level_resource=nipyapi.registry.Permissions(
                            can_read=False, can_write=False, can_delete=False)
                    ),
                    access_policies=[],
                    revision=nipyapi.registry.RevisionInfo(
                        client_id=None,
                        last_modifier='CN=alice@email.com, OU=NIFI',
                        version=0
                    )
                )
            ]
        )

    def mock_nipyapi_security_update_access_policy(resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    response_buckets_read = Security().remove_user_group_from_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)
    response_buckets_write = Security().remove_user_group_from_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.WRITE)
    response_buckets_delete = Security().remove_user_group_from_nifi_registry_bucket_policy(
        'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.DELETE)

    # Assert
    assert getattr(response_buckets_read,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_read, 'action') == 'read'
    assert len(getattr(response_buckets_read, 'users')) == 0
    assert getattr(response_buckets_write,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_write, 'action') == 'write'
    assert len(getattr(response_buckets_write, 'users')) == 0
    assert getattr(response_buckets_delete,
                   'resource') == '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce'
    assert getattr(response_buckets_delete, 'action') == 'delete'
    assert len(getattr(response_buckets_delete, 'users')) == 0


def test_remove_user_from_nifi_registry_bucket_policy_with_user_not_member(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.UserGroup(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return nipyapi.registry.Bucket(
            link=nipyapi.registry.JaxbLink(
                href='/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params={'rel': 'self'}
            ),
            identifier='93867421-ff7b-4192-bbed-f1fd48209cce',
            name='study-bucket',
            created_timestamp=1629392300771,
            description=None,
            allow_bundle_redeploy=False,
            allow_public_read=False,
            permissions=nipyapi.registry.Permissions(
                can_read=True,
                can_write=True,
                can_delete=True
            ),
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return nipyapi.registry.AccessPolicy(
            identifier='67825475-ae32-4934-90b1-e77e7f1ecb73',
            resource=resource_value,
            action=action_value,
            configurable=True,
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            users=[],
            user_groups=[]
        )

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not have read permission for study-bucket. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_bucket_policy_with_no_existing_bucket_policy(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.User(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            user_groups=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return nipyapi.registry.Bucket(
            link=nipyapi.registry.JaxbLink(
                href='/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params={'rel': 'self'}
            ),
            identifier='93867421-ff7b-4192-bbed-f1fd48209cce',
            name='study-bucket',
            created_timestamp=1629392300771,
            description=None,
            allow_bundle_redeploy=False,
            allow_public_read=False,
            permissions=nipyapi.registry.Permissions(
                can_read=True,
                can_write=True,
                can_delete=True
            ),
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            )
        )

    def mock_nipyapi_security_get_access_policy_for_resource(resource_value, action_value, resource_id, service):
        return None

    def mock_nipyapi_security_update_access_policy(resource_policy, service):
        return resource_policy

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.security, 'get_access_policy_for_resource',
                        mock_nipyapi_security_get_access_policy_for_resource)
    monkeypatch.setattr(nipyapi.security, 'update_access_policy',
                        mock_nipyapi_security_update_access_policy)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert f'read study-bucket bucket policy, does not exist. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_bucket_policy_with_missing_bucket(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return nipyapi.registry.User(
            identifier='7770921e-983c-49ab-87ad-b3b29dd23aed',
            identity='registry-user-group',
            configurable=True,
            resource_permissions=nipyapi.registry.ResourcePermissions(
                buckets=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                tenants=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                policies=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                proxy=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False),
                any_top_level_resource=nipyapi.registry.Permissions(
                    can_read=False, can_write=False, can_delete=False)
            ),
            access_policies=[],
            revision=nipyapi.registry.RevisionInfo(
                client_id=None,
                last_modifier=None,
                version=0
            ),
            user_groups=[]
        )

    def mock_get_nifi_registry_bucket(self, bucket_name):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)
    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket',
                        mock_get_nifi_registry_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'Bucket, study-bucket not found. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_bucket_policy_with_invalid_action(setup):
    # Arrange
    invalid_action_values = [NifiRegistryResourcePolicyAction,
                             'random_invalid_string', 123, NifiAccessPolicyResource.CONTROLLER]

    # Act
    for invalid_action_value in invalid_action_values:
        with pytest.raises(ValueError) as exec_info:
            Security().remove_user_group_from_nifi_registry_bucket_policy(
                'registry-user-group', 'study-bucket', invalid_action_value)

    # Assert
    assert 'Value is not Enum type of NifiRegistryResourcePolicyAction' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_bucket_policy_with_missing_user(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        return None

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_bucket_policy(
            'registry-user-group', 'study-bucket', NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'User group, registry-user-group does not exist. No action taken.' == str(
        exec_info.value)


def test_remove_user_group_from_nifi_registry_bucket_policy_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_security_get_service_user_group(user_group_identity, identifier_type, service):
        raise ValueError('API error with get service user group.')

    monkeypatch.setattr(nipyapi.security, 'get_service_user_group',
                        mock_nipyapi_security_get_service_user_group)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Security().remove_user_group_from_nifi_registry_bucket_policy('registry-user-group',
                                                                      NifiRegistryResourcePolicy.BUCKETS, NifiRegistryResourcePolicyAction.READ)

    # Assert
    assert 'API error with get service user group.' == str(exec_info.value)
