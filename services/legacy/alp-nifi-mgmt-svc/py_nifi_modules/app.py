import sys
import jsonpickle

from libs.canvas import Canvas
from libs.controller import Controller
from libs.security import Security
from libs.versioning import Versioning

from utils.enum_types import Service
from utils.enum_types import NifiAccessPolicyAction
from utils.enum_types import NifiAccessPolicyResource
from utils.enum_types import NifiProcessGroupAccessPolicyResource
from utils.enum_types import NifiRegistryResourcePolicyAction
from utils.enum_types import NifiRegistryResourcePolicy
from utils.enum_types import Intent

def _get_service_enum(service):
    try:
        Service.is_valid_enum_value(service)
        return Service(service)
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_to_user_group_relationship(intent: str, user_identity: str, user_group_identity: str, service: str):
    try:    
        Intent.is_valid_enum_value(intent)
        Service.is_valid_enum_value(service)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_to_user_group(
                user_identity,
                user_group_identity,
                Service(service)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_from_user_group(
                user_identity,
                user_group_identity,
                Service(service)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_to_nifi_access_policy_relationship(intent: str, user_identity: str, resource: str, action: str):
    try:    
        Intent.is_valid_enum_value(intent)
        NifiAccessPolicyResource.is_valid_enum_value(resource)
        NifiAccessPolicyAction.is_valid_enum_value(action)


        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_to_nifi_access_policy(
                user_identity,
                NifiAccessPolicyResource(resource),
                NifiAccessPolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_from_nifi_access_policy(
                user_identity,
                NifiAccessPolicyResource(resource),
                NifiAccessPolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_to_nifi_process_group_access_policy_relationship(intent: str, user_identity: str, process_group_name: str, resource: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiProcessGroupAccessPolicyResource.is_valid_enum_value(resource)
        NifiAccessPolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_to_nifi_process_group_access_policy(
                user_identity,
                process_group_name,
                NifiProcessGroupAccessPolicyResource(resource), 
                NifiAccessPolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_from_nifi_process_group_access_policy(
                user_identity,
                process_group_name,
                NifiProcessGroupAccessPolicyResource(resource), 
                NifiAccessPolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_to_nifi_registry_resource_policy_relationship(intent: str, user_identity: str, resource: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiRegistryResourcePolicy.is_valid_enum_value(resource)
        NifiRegistryResourcePolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_to_nifi_registry_resource_policy(
                user_identity,
                NifiRegistryResourcePolicy(resource),
                NifiRegistryResourcePolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_from_nifi_registry_resource_policy(
                user_identity,
                NifiRegistryResourcePolicy(resource),
                NifiRegistryResourcePolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_to_nifi_registry_bucket_policy_relationship(intent: str, user_identity: str, bucket_name: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiRegistryResourcePolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_to_nifi_registry_bucket_policy(
                user_identity,
                bucket_name,
                NifiRegistryResourcePolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_from_nifi_registry_bucket_policy(
                user_identity,
                bucket_name,
                NifiRegistryResourcePolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_group_to_nifi_access_policy_relationship(intent: str, user_group_identity: str, resource: str, action: str):
    try:    
        Intent.is_valid_enum_value(intent)
        NifiAccessPolicyResource.is_valid_enum_value(resource)
        NifiAccessPolicyAction.is_valid_enum_value(action)


        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_group_to_nifi_access_policy(
                user_group_identity,
                NifiAccessPolicyResource(resource),
                NifiAccessPolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_group_from_nifi_access_policy(
                user_group_identity,
                NifiAccessPolicyResource(resource),
                NifiAccessPolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_group_to_nifi_process_group_access_policy_relationship(intent: str, user_group_identity: str, process_group_name: str, resource: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiProcessGroupAccessPolicyResource.is_valid_enum_value(resource)
        NifiAccessPolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_group_to_nifi_process_group_access_policy(
                user_group_identity,
                process_group_name,
                NifiProcessGroupAccessPolicyResource(resource), 
                NifiAccessPolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_group_from_nifi_process_group_access_policy(
                user_group_identity,
                process_group_name,
                NifiProcessGroupAccessPolicyResource(resource), 
                NifiAccessPolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_group_to_nifi_registry_resource_policy_relationship(intent: str, user_group_identity: str, resource: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiRegistryResourcePolicy.is_valid_enum_value(resource)
        NifiRegistryResourcePolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_group_to_nifi_registry_resource_policy(
                user_group_identity,
                NifiRegistryResourcePolicy(resource),
                NifiRegistryResourcePolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_group_from_nifi_registry_resource_policy(
                user_group_identity,
                NifiRegistryResourcePolicy(resource),
                NifiRegistryResourcePolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def _security_modify_user_group_to_nifi_registry_bucket_policy_relationship(intent: str, user_group_identity: str, bucket_name: str, action: str):
    try:
        Intent.is_valid_enum_value(intent)
        NifiRegistryResourcePolicyAction.is_valid_enum_value(action)

        if Intent(intent) is Intent.ADD_MEMBER:
            return Security().add_user_group_to_nifi_registry_bucket_policy(
                user_group_identity,
                bucket_name,
                NifiRegistryResourcePolicyAction(action)
            )
        if Intent(intent) is Intent.REMOVE_MEMBER:
            return Security().remove_user_group_from_nifi_registry_bucket_policy(
                user_group_identity,
                bucket_name,
                NifiRegistryResourcePolicyAction(action)
            )
    except Exception as e:
        raise ValueError(e)

def switch(option):
    switcher = {
        "get_nifi_canvas_root_process_group_id": 
            lambda: Canvas().get_nifi_canvas_root_process_group_id(),
        "get_nifi_canvas_process_group_id": 
            lambda: Canvas().get_nifi_canvas_process_group_id(sys.argv[2]),
        "remove_process_group_from_nifi_canvas": 
            lambda: Canvas().remove_process_group_from_nifi_canvas(sys.argv[2]),
        "deploy_latest_version_flow_to_nifi_canvas": 
            lambda: Canvas().deploy_latest_version_flow_to_nifi_canvas(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], (sys.argv[6], sys.argv[7])),
        "update_flow_version_in_nifi_canvas": 
            lambda: Canvas().update_flow_version_in_nifi_canvas(sys.argv[2], sys.argv[3]),
        "get_users":
            lambda: Security().get_users(_get_service_enum(sys.argv[2])),
        "get_user":
            lambda: Security().get_user(sys.argv[2], _get_service_enum(sys.argv[3])),
        "get_user_group_identities":
            lambda: Security().get_user_group_identities(sys.argv[2], _get_service_enum(sys.argv[3])),
        "get_user_groups":
            lambda: Security().get_user_groups(_get_service_enum(sys.argv[2])),
        "get_user_group":
            lambda: Security().get_user_group(sys.argv[2], _get_service_enum(sys.argv[3])),
        "create_new_user": 
            lambda: Security().create_new_user(sys.argv[2], _get_service_enum(sys.argv[3])),
        "create_new_user_group": 
            lambda: Security().create_new_user_group(sys.argv[2], _get_service_enum(sys.argv[3])),
        "update_user_identity":
            lambda: Security().update_user_identity(sys.argv[2], sys.argv[3], _get_service_enum(sys.argv[4])),
        "update_user_group_identity":
            lambda: Security().update_user_group_identity(sys.argv[2], sys.argv[3], _get_service_enum(sys.argv[4])),
        "modify_user_to_user_group_relationship": 
            lambda: _security_modify_user_to_user_group_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_to_nifi_access_policy_relationship": 
            lambda: _security_modify_user_to_nifi_access_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_to_nifi_process_group_access_policy_relationship": 
            lambda: _security_modify_user_to_nifi_process_group_access_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]),
        "modify_user_to_nifi_registry_resource_policy_relationship": 
            lambda: _security_modify_user_to_nifi_registry_resource_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_to_nifi_registry_bucket_policy_relationship": 
            lambda: _security_modify_user_to_nifi_registry_bucket_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_group_to_nifi_access_policy_relationship": 
            lambda: _security_modify_user_group_to_nifi_access_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_group_to_nifi_process_group_access_policy_relationship": 
            lambda: _security_modify_user_group_to_nifi_process_group_access_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]),
        "modify_user_group_to_nifi_registry_resource_policy_relationship": 
            lambda: _security_modify_user_group_to_nifi_registry_resource_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "modify_user_group_to_nifi_registry_bucket_policy_relationship": 
            lambda: _security_modify_user_group_to_nifi_registry_bucket_policy_relationship(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]),
        "remove_user": 
            lambda: Security().remove_user(sys.argv[2], _get_service_enum(sys.argv[3])),
        "remove_user_group": 
            lambda: Security().remove_user_group(sys.argv[2], _get_service_enum(sys.argv[3])),
        "get_nifi_registry_bucket": 
            lambda: Versioning().get_nifi_registry_bucket(sys.argv[2]),
        "get_nifi_registry_flow_list_in_bucket": 
            lambda: Versioning().get_nifi_registry_flow_list_in_bucket(sys.argv[2]),
        "get_nifi_registry_flow_in_bucket": 
            lambda: Versioning().get_nifi_registry_flow_in_bucket(sys.argv[2], sys.argv[3]),
        "get_nifi_registry_client_list_in_nifi": 
            lambda: Controller().get_nifi_registry_client_list_in_nifi(),
        "get_nifi_registry_client_in_nifi": 
            lambda: Controller().get_nifi_registry_client_in_nifi(sys.argv[2]),
        "create_nifi_registry_client_in_nifi": 
            lambda: Controller().create_nifi_registry_client_in_nifi(sys.argv[2], sys.argv[3], sys.argv[4]),
        "update_nifi_registry_client_name_in_nifi": 
            lambda: Controller().update_nifi_registry_client_name_in_nifi(sys.argv[2], sys.argv[3]),
        "update_nifi_registry_client_uri_in_nifi": 
            lambda: Controller().update_nifi_registry_client_uri_in_nifi(sys.argv[2], sys.argv[3]),
        "update_nifi_registry_client_description_in_nifi": 
            lambda: Controller().update_nifi_registry_client_description_in_nifi(sys.argv[2], sys.argv[3]),
        "remove_nifi_registry_client_in_nifi": 
            lambda: Controller().remove_nifi_registry_client_in_nifi(sys.argv[2]),
    }
    
    func = switcher.get(option, lambda: 'Invalid switch option from argv[1]')
    return func()

try:
    result = switch(sys.argv[1])
    print(jsonpickle.encode(result))
except Exception as err_message:
    print(f'[PY_NIFI_MODULE_ERROR] {err_message}', end='')
