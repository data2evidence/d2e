import pytest
import nipyapi

from libs.versioning import Versioning

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

# Test get_nifi_registry_bucket
def test_get_nifi_registry_bucket(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_get_registry_bucket(bucket_name, identifier_type):
        return [
            nipyapi.registry.Bucket(
                link = nipyapi.registry.JaxbLink(
                    href = '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                    params = { 'rel': 'self' }
                ),
                identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
                name = 'study-bucket',
                created_timestamp = 1629392300771,
                description = None,
                allow_bundle_redeploy = False,
                allow_public_read = False,
                permissions = nipyapi.registry.Permissions(
                    can_read = True, 
                    can_write = True, 
                    can_delete = True
                ),
                revision = nipyapi.registry.RevisionInfo(
                    client_id = None,
                    last_modifier = None, 
                    version = 0
                )
            ),
            nipyapi.registry.Bucket(
                link = nipyapi.registry.JaxbLink(
                    href = '/buckets/d607c76a-557e-404f-80f5-e2cbbe5674c9',
                    params = { 'rel': 'self' }
                ),
                identifier = 'd607c76a-557e-404f-80f5-e2cbbe5674c9',
                name = 'databaseService-bucket',
                created_timestamp = 1629392300771,
                description = None,
                allow_bundle_redeploy = False,
                allow_public_read = False,
                permissions = nipyapi.registry.Permissions(
                    can_read = True, 
                    can_write = True, 
                    can_delete = True
                ),
                revision = nipyapi.registry.RevisionInfo(
                    client_id = None,
                    last_modifier = None, 
                    version = 0
                )
            )
        ]

    monkeypatch.setattr(nipyapi.versioning, 'get_registry_bucket', mock_nipyapi_versioning_get_registry_bucket)

    # Act & Assert
    assert getattr(Versioning().get_nifi_registry_bucket('study-bucket'), 'name') == 'study-bucket'

def test_get_nifi_registry_bucket_with_missing_bucket(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_get_registry_bucket(bucket_name, identifier_type):
        return []

    monkeypatch.setattr(nipyapi.versioning, 'get_registry_bucket', mock_nipyapi_versioning_get_registry_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Versioning().get_nifi_registry_bucket('study-bucket')
    
    # Assert
    assert 'Bucket, study-bucket does not exist.' == str(exec_info.value)

def test_get_nifi_registry_bucket_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_nipyapi_versioning_get_registry_bucket(bucket_name, identifier_type):
        raise ValueError('API error with get registry bucket.')

    monkeypatch.setattr(nipyapi.versioning, 'get_registry_bucket', mock_nipyapi_versioning_get_registry_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Versioning().get_nifi_registry_bucket('study-bucket')
    
    # Assert
    assert 'API error with get registry bucket.' == str(exec_info.value)


# Test get_nifi_registry_flow_list_in_bucket
def test_get_nifi_registry_flow_list_in_bucket(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_bucket(bucket_name, identifier_type):
        return nipyapi.registry.Bucket(
            link = nipyapi.registry.JaxbLink(
                href = '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params = { 'rel': 'self' }
            ),
            identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
            name = 'study-bucket',
            created_timestamp = 1629392300771,
            description = None,
            allow_bundle_redeploy = False,
            allow_public_read = False,
            permissions = nipyapi.registry.Permissions(
                can_read = True, 
                can_write = True, 
                can_delete = True
            ),
            revision = nipyapi.registry.RevisionInfo(
                client_id = None,
                last_modifier = None, 
                version = 0
            )
        )

    def mock_nipyapi_versioning_list_flows_in_bucket(bucket_identifier):
        return 'VersionedFlow'

    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket', mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.versioning, 'list_flows_in_bucket', mock_nipyapi_versioning_list_flows_in_bucket)

    # Act & Assert
    assert Versioning().get_nifi_registry_flow_list_in_bucket('study-bucket') is not None

def test_get_nifi_registry_flow_list_in_bucket_with_missing_bucket(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_bucket(bucket_name, identifier_type):
        raise ValueError('Bucket, study-bucket does not exist.')

    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket', mock_get_nifi_registry_bucket)
 
    # Act
    with pytest.raises(ValueError) as exec_info:
        Versioning().get_nifi_registry_flow_list_in_bucket('study-bucket')

    # Assert
    assert 'Bucket, study-bucket does not exist.' == str(exec_info.value)

def test_get_nifi_registry_flow_list_in_bucket_with_api_error(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_bucket(bucket_name, identifier_type):
        return nipyapi.registry.Bucket(
            link = nipyapi.registry.JaxbLink(
                href = '/buckets/93867421-ff7b-4192-bbed-f1fd48209cce',
                params = { 'rel': 'self' }
            ),
            identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
            name = 'study-bucket',
            created_timestamp = 1629392300771,
            description = None,
            allow_bundle_redeploy = False,
            allow_public_read = False,
            permissions = nipyapi.registry.Permissions(
                can_read = True, 
                can_write = True, 
                can_delete = True
            ),
            revision = nipyapi.registry.RevisionInfo(
                client_id = None,
                last_modifier = None, 
                version = 0
            )
        )

    def mock_nipyapi_versioning_list_flows_in_bucket(bucket_identifier):
        raise ValueError('API error with list flows in bucket.')

    monkeypatch.setattr(Versioning, 'get_nifi_registry_bucket', mock_get_nifi_registry_bucket)
    monkeypatch.setattr(nipyapi.versioning, 'list_flows_in_bucket', mock_nipyapi_versioning_list_flows_in_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        Versioning().get_nifi_registry_flow_list_in_bucket('study-bucket')

    # Assert
    assert 'API error with list flows in bucket.' == str(exec_info.value)


# Test get_nifi_registry_flow_in_bucket
def test_get_nifi_registry_flow_in_bucket(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_flow_list_in_bucket(bucket_name, identifier_type):
        return [
            nipyapi.registry.VersionedFlow(
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
            ),
            nipyapi.registry.VersionedFlow(
                bucket_identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
                bucket_name = 'study-bucket',
                created_timestamp = 1629392300827,
                description = '',
                identifier = '94dabb85-0b98-476e-8958-796c32e65d7f',
                link = nipyapi.registry.JaxbLink(
                    href = 'buckets/93867421-ff7b-4192-bbed-f1fd48209cce/flows/94dabb85-0b98-476e-8958-796c32e65d7f',
                    params = { 'rel': 'self' }
                ),
                modified_timestamp = 1629392300827,
                name = 'GenericDataModelPipeline',
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
                version_count = 75
            )
        ]

    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_list_in_bucket', mock_get_nifi_registry_flow_list_in_bucket)

    # Act & Assert
    assert Versioning().get_nifi_registry_flow_in_bucket('study-bucket', 'StudyDataDonationAPI') is not None

def test_get_nifi_registry_flow_in_bucket_with_missing_bucket(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_flow_list_in_bucket(self, bucket_name):
        raise ValueError(f'Bucket, {bucket_name} does not exist.')

    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_list_in_bucket', mock_get_nifi_registry_flow_list_in_bucket)

    # Act`
    with pytest.raises(ValueError) as exec_info:
        Versioning().get_nifi_registry_flow_in_bucket('missing-study-bucket', 'StudyDataDonationAPI')

    # Assert
    assert 'Bucket, missing-study-bucket does not exist.' == str(exec_info.value)

def test_get_nifi_registry_flow_in_bucket_with_missing_flow(setup, monkeypatch):
    # Arrange
    def mock_get_nifi_registry_flow_list_in_bucket(bucket_name, identifier_type):
        return [
            nipyapi.registry.VersionedFlow(
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
            ),
            nipyapi.registry.VersionedFlow(
                bucket_identifier = '93867421-ff7b-4192-bbed-f1fd48209cce',
                bucket_name = 'study-bucket',
                created_timestamp = 1629392300827,
                description = '',
                identifier = '94dabb85-0b98-476e-8958-796c32e65d7f',
                link = nipyapi.registry.JaxbLink(
                    href = 'buckets/93867421-ff7b-4192-bbed-f1fd48209cce/flows/94dabb85-0b98-476e-8958-796c32e65d7f',
                    params = { 'rel': 'self' }
                ),
                modified_timestamp = 1629392300827,
                name = 'GenericDataModelPipeline',
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
                version_count = 75
            )
        ]

    monkeypatch.setattr(Versioning, 'get_nifi_registry_flow_list_in_bucket', mock_get_nifi_registry_flow_list_in_bucket)

    # Act
    with pytest.raises(ValueError) as exec_info:
        assert Versioning().get_nifi_registry_flow_in_bucket('study-bucket', 'Missing-StudyDataDonationAPI') is not None

    # Assert
    assert 'Flow, Missing-StudyDataDonationAPI does not exist.' == str(exec_info.value)

