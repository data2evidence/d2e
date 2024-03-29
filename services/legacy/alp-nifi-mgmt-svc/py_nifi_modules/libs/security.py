import nipyapi

from utils import config
from libs.canvas import Canvas
from libs.versioning import Versioning
from utils.enum_types import Service
from utils.enum_types import NifiAccessPolicyResource
from utils.enum_types import NifiProcessGroupAccessPolicyResource
from utils.enum_types import NifiRegistryResourcePolicy
from utils.enum_types import NifiAccessPolicyAction
from utils.enum_types import NifiRegistryResourcePolicyAction
from utils.enum_types import Intent

class Security:
    def __init__(self):
        config.setup_nifi_config()
        config.setup_nifi_registry_config()

    # User Management
    def get_users(self, service: Service):
        try:
            Service.is_valid_enum_name(service)
            return nipyapi.security.list_service_users(service.value)
        except Exception as e: 
            raise ValueError(e)

    def get_user(self, user_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            return user_obj
        except Exception as e: 
            raise ValueError(e)
    
    # Gets the identities of all groups user is in
    def get_user_group_identities(self, user_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')
        
            # Extracts Identities of all groups user is part of 
            if service is Service.NIFI and user_obj.component.user_groups:
                return [user_group.component.identity for user_group in user_obj.component.user_groups]
            elif service is Service.NIFI_REGISTRY and user_obj.user_groups:
                return [user_group.identity for user_group in user_obj.user_groups]
            else:
                return []
        except Exception as e: 
            raise ValueError(e)

    def create_new_user(self, user_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)

            if user_obj is not None: 
                raise ValueError(f'User, {user_identity} already exist. No action taken.')

            return nipyapi.security.create_service_user(user_identity, service.value)
        except Exception as e: 
            raise ValueError(e)

    def update_user_identity(self, user_identity: str, new_user_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)

            if user_identity == new_user_identity:
                raise ValueError(f'Current user identity, {user_identity} and new user identity, {new_user_identity} are exactly the same. No action taken.')

            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            if service is Service.NIFI:
                setattr(getattr(user_obj, 'component'), 'identity', new_user_identity)
                
                return getattr(nipyapi, service.value).TenantsApi().update_user(
                    getattr(getattr(user_obj, 'component'), 'id'), 
                    user_obj    
                )

            if service is Service.NIFI_REGISTRY:
                setattr(user_obj, 'identity', new_user_identity)
                
                return getattr(nipyapi, service.value).TenantsApi().update_user(
                    getattr(user_obj, 'identifier'), 
                    user_obj
                )
        except Exception as e: 
            raise ValueError(e)

    def add_user_to_user_group(self, user_identity: str, user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            if service is service.NIFI:
                for user_in_group in getattr(getattr(user_group_obj, 'component'), 'users'):
                    if getattr(getattr(user_in_group, 'component'), 'id') == getattr(getattr(user_obj, 'component'), 'id'):
                        raise ValueError(f'User, {user_identity} is already a member of user group, {user_group_identity}. No action taken.')

                exisiting_users_in_group = getattr(getattr(user_group_obj, 'component'), 'users')
                exisiting_users_in_group.append({ 'id': getattr(getattr(user_obj, 'component'), 'id') })
                
                user_group_obj = nipyapi.nifi.UserGroupEntity(
                    revision=nipyapi.nifi.RevisionDTO(
                        version = getattr(getattr(user_group_obj, 'revision'), 'version')
                    ),
                    component=nipyapi.nifi.UserGroupDTO(
                        id = getattr(getattr(user_group_obj, 'component'), 'id'),
                        identity = getattr(getattr(user_group_obj, 'component'), 'identity'),
                        users = exisiting_users_in_group
                    )
                )

                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(getattr(user_group_obj, 'component'), 'id'), 
                    user_group_obj
                )
            
            if service is service.NIFI_REGISTRY:
                for user_in_group in getattr(user_group_obj, 'users'):
                    if getattr(user_in_group, 'identity') == getattr(user_obj, 'identity'):
                        raise ValueError(f'User, {user_identity} is already a member of user group, {user_group_identity}. No action taken.')
        
                exisiting_users_in_group = getattr(user_group_obj, 'users')
                exisiting_users_in_group.append({ 'identifier': getattr(user_obj, 'identifier') })
                
                user_group_obj = nipyapi.registry.UserGroup(
                    identifier = getattr(user_group_obj, 'identifier'),
                    identity = getattr(user_group_obj, 'identity'),
                    revision = nipyapi.registry.RevisionInfo(
                        version = getattr(getattr(user_group_obj, 'revision'), 'version')
                    ),
                    users = exisiting_users_in_group        
                )

                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(user_group_obj, 'identifier'), 
                    user_group_obj
                )
        except Exception as e: 
            raise ValueError(e)

    def add_user_to_nifi_access_policy(self, user_identity: str, resource: NifiAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            NifiAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            access_policy_obj = self._create_or_get_nifi_access_policy(
                resource, 
                action, 
                Intent.ADD_MEMBER
            )

            for user in getattr(getattr(access_policy_obj, 'component'), 'users'):
                if getattr(getattr(user, 'component'), 'identity') == user_identity:
                    raise ValueError(f'User, {user_identity} already in {action.value} access policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_to_access_policy(
                user_obj,
                access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e:
            raise ValueError(e)

    def add_user_to_nifi_process_group_access_policy(self, user_identity: str, process_group_name: str, resource: NifiProcessGroupAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            NifiProcessGroupAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            process_group_access_policy_obj = self._create_or_get_nifi_process_group_access_policy(
                process_group_name, 
                resource, 
                action, 
                Intent.ADD_MEMBER
            )
            
            for user in getattr(getattr(process_group_access_policy_obj, 'component'), 'users'):
                if getattr(getattr(user, 'component'), 'identity') == user_identity:
                    raise ValueError(f'User, {user_identity} already in {action.value} process group access policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_to_access_policy(
                user_obj,
                process_group_access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def add_user_to_nifi_registry_resource_policy(self, user_identity: str, resource: NifiRegistryResourcePolicy, action: NifiRegistryResourcePolicyAction):
        try:
            NifiRegistryResourcePolicy.is_valid_enum_name(resource)
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist in Nifi Registry. No action taken.')

            resource_policy_obj = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                '',
                Service.NIFI_REGISTRY.value
            )

            for user in getattr(resource_policy_obj, 'users'):
                if getattr(user, 'identity') == user_identity:
                    raise ValueError(f'User, {user_identity} already in {action.value} resource policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_to_access_policy(
                user_obj,
                resource_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e:
            raise ValueError(e)

    def add_user_to_nifi_registry_bucket_policy(self, user_identity: str, bucket_name: str, action: NifiRegistryResourcePolicyAction):
        try:
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            bucket_policy_obj = self._create_or_get_nifi_registry_bucket_policy(bucket_name, action, Intent.ADD_MEMBER)

            for user in getattr(bucket_policy_obj, 'users'):
                if getattr(user, 'identity') == user_identity:
                    raise ValueError(f'User, {user_identity} already has {action.value} permission for, {bucket_name}. No action taken.')

            return nipyapi.security.add_user_to_access_policy(
                user_obj,
                bucket_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user(self, user_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            return nipyapi.security.remove_service_user(user_obj, service.value)
        except Exception as e: 
            raise ValueError(e)

    def remove_user_from_user_group(self, user_identity: str, user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)

            users_in_group = []
            user_obj_is_member = False
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', service.value)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            if service is service.NIFI:
                for user_in_group in getattr(getattr(user_group_obj, 'component'), 'users'):
                    if getattr(getattr(user_in_group, 'component'), 'id') == getattr(getattr(user_obj, 'component'), 'id'):
                        user_obj_is_member = True
                        continue
                    else:
                        users_in_group.append({
                            'id': getattr(getattr(user_in_group, 'component'), 'id')
                        })

                if user_obj_is_member == False:
                    raise ValueError(f'User, {user_identity} is not a member of user group, {user_group_identity}. No action taken.')

                user_group_obj = nipyapi.nifi.UserGroupEntity(
                    revision=nipyapi.nifi.RevisionDTO(
                        version = getattr(getattr(user_group_obj, 'revision'), 'version')
                    ),
                    component=nipyapi.nifi.UserGroupDTO(
                        id = getattr(getattr(user_group_obj, 'component'), 'id'),
                        identity = getattr(getattr(user_group_obj, 'component'), 'identity'),
                        users = users_in_group
                    )
                )

                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(getattr(user_group_obj, 'component'), 'id'), 
                    user_group_obj
                )

            if service is service.NIFI_REGISTRY:
                for user_in_group in getattr(user_group_obj, 'users'):
                    if getattr(user_in_group, 'identity') == getattr(user_obj, 'identity'):
                        user_obj_is_member = True
                        continue
                    else:
                        users_in_group.append({
                            'identifier': getattr(user_in_group, 'identifier')
                        })

                if user_obj_is_member == False:
                    raise ValueError(f'User, {user_identity} is not a member of user group, {user_group_identity}. No action taken.')

                user_group_obj = nipyapi.registry.UserGroup(
                    identifier = getattr(user_group_obj, 'identifier'),
                    identity = getattr(user_group_obj, 'identity'),
                    revision=nipyapi.registry.RevisionInfo(
                        version = getattr(getattr(user_group_obj, 'revision'), 'version')
                    ),
                    users = users_in_group     
                )

                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(user_group_obj, 'identifier'), 
                    user_group_obj
                )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_from_nifi_access_policy(self, user_identity: str, resource: NifiAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            user_obj_is_member = False
            NifiAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI.value) is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            access_policy_obj = self._create_or_get_nifi_access_policy(
                resource, 
                action, 
                Intent.REMOVE_MEMBER
            )

            if access_policy_obj is None:
                raise ValueError(f'{action.value} access policy, {resource.value} does not exist. No action taken.')

            for user in getattr(getattr(access_policy_obj, 'component'), 'users'):
                if getattr(getattr(user, 'component'), 'identity') == user_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User, {user_identity} does not belong to {action.value} access policy, {resource.value}. No action taken.')

            access_policy_users = getattr(getattr(access_policy_obj, 'component'), 'users')
            filtered_access_policy_users = [user for user in access_policy_users if getattr(getattr(user, 'component'), 'identity') != user_identity]
            setattr(getattr(access_policy_obj, 'component'), 'users', filtered_access_policy_users)

            return nipyapi.security.update_access_policy(
                access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_from_nifi_process_group_access_policy(self, user_identity: str, process_group_name: str, resource: NifiProcessGroupAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            user_obj_is_member = False
            NifiProcessGroupAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI.value) is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            process_group_access_policy_obj = self._create_or_get_nifi_process_group_access_policy(
                process_group_name, 
                resource, 
                action, 
                Intent.REMOVE_MEMBER
            )
            
            if process_group_access_policy_obj is None:
                raise ValueError(f'{action.value} process group access policy, {resource.value} does not exist. No action taken.')

            for user in getattr(getattr(process_group_access_policy_obj, 'component'), 'users'):
                if getattr(getattr(user, 'component'), 'identity') == user_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User, {user_identity} does not belong to {action.value} access policy, {resource.value}. No action taken.')

            access_policy_users = getattr(getattr(process_group_access_policy_obj, 'component'), 'users')
            filtered_access_policy_users = [user for user in access_policy_users if getattr(getattr(user, 'component'), 'identity') != user_identity]
            setattr(getattr(process_group_access_policy_obj, 'component'), 'users', filtered_access_policy_users)

            return nipyapi.security.update_access_policy(
                process_group_access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_from_nifi_registry_resource_policy(self, user_identity: str, resource: NifiRegistryResourcePolicy, action: NifiRegistryResourcePolicyAction):
        try:
            user_obj_is_member = False
            NifiRegistryResourcePolicy.is_valid_enum_name(resource)
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI_REGISTRY.value) is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            resource_policy_obj = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                '',
                Service.NIFI_REGISTRY.value
            )

            for user in getattr(resource_policy_obj, 'users'):
                if getattr(user, 'identity') == user_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User, {user_identity} does not belong to {action.value} resource policy, {resource.value}. No action taken.')

            resource_policy_users = getattr(resource_policy_obj, 'users')
            filtered_resource_policy_users = [user for user in resource_policy_users if getattr(user, 'identity') != user_identity]
            setattr(resource_policy_obj, 'users', filtered_resource_policy_users)

            return nipyapi.security.update_access_policy(
                resource_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_from_nifi_registry_bucket_policy(self, user_identity: str, bucket_name: str, action: NifiRegistryResourcePolicyAction):
        try:
            user_obj_is_member = False
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_obj = nipyapi.security.get_service_user(user_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_obj is None: 
                raise ValueError(f'User, {user_identity} does not exist. No action taken.')

            bucket_policy_obj = self._create_or_get_nifi_registry_bucket_policy(bucket_name, action, Intent.REMOVE_MEMBER)

            if bucket_policy_obj is None:
                raise ValueError(f'{action.value} {bucket_name} bucket policy, does not exist. No action taken.')

            for user in getattr(bucket_policy_obj, 'users'):
                if getattr(user, 'identity') == user_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User, {user_identity} does not have {action.value} permission for {bucket_name}. No action taken.')

            bucket_policy_users = getattr(bucket_policy_obj, 'users')
            filtered_bucket_policy_users = [user for user in bucket_policy_users if getattr(user, 'identity') != user_identity]
            setattr(bucket_policy_obj, 'users', filtered_bucket_policy_users)

            return nipyapi.security.update_access_policy(
                bucket_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)


    # User Group Management
    def get_user_groups(self, service: Service):
        try:
            Service.is_valid_enum_name(service)
            return nipyapi.security.list_service_user_groups(service.value)
        except Exception as e: 
            raise ValueError(e)

    def get_user_group(self, user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            return user_obj
        except Exception as e: 
            raise ValueError(e)

    def create_new_user_group(self, user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_group_obj is not None: 
                raise ValueError(f'User group, {user_group_identity} already exist. No action taken.')

            return nipyapi.security.create_service_user_group(user_group_identity, service.value)
        except Exception as e: 
            raise ValueError(e)

    def update_user_group_identity(self, user_group_identity: str, new_user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)

            if user_group_identity == new_user_group_identity:
                raise ValueError(f'Current user group identity, {user_group_identity} and new user group identity, {new_user_group_identity} are exactly the same. No action taken.')

            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            if service is Service.NIFI:
                setattr(getattr(user_group_obj, 'component'), 'identity', new_user_group_identity)
                
                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(getattr(user_group_obj, 'component'), 'id'), 
                    user_group_obj    
                )

            if service is Service.NIFI_REGISTRY:
                setattr(user_group_obj, 'identity', new_user_group_identity)
                
                return getattr(nipyapi, service.value).TenantsApi().update_user_group(
                    getattr(user_group_obj, 'identifier'), 
                    user_group_obj
                )
        except Exception as e: 
            raise ValueError(e)

    def add_user_group_to_nifi_access_policy(self, user_group_identity: str, resource: NifiAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            NifiAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist in {Service.NIFI.value}. No action taken.')

            access_policy = self._create_or_get_nifi_access_policy(resource, action, Intent.ADD_MEMBER)

            for user_group in getattr(getattr(access_policy, 'component'), 'user_groups'):
                if getattr(getattr(user_group, 'component'), 'identity') == user_group_identity:
                    raise ValueError(f'User group, {user_group_identity} already in {action.value} access policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_group_to_access_policy(
                user_group_obj,
                access_policy,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def add_user_group_to_nifi_process_group_access_policy(self, user_group_identity: str, process_group_name: str, resource: NifiProcessGroupAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            NifiProcessGroupAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            process_group_access_policy = self._create_or_get_nifi_process_group_access_policy(
                process_group_name, 
                resource, 
                action, 
                Intent.ADD_MEMBER
            )
            for user_group in getattr(getattr(process_group_access_policy, 'component'), 'user_groups'):
                if getattr(getattr(user_group, 'component'), 'identity') == user_group_identity:
                    raise ValueError(f'User group, {user_group_identity} already in {action.value} process group access policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_group_to_access_policy(
                user_group_obj,
                process_group_access_policy,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def add_user_group_to_nifi_registry_resource_policy(self, user_group_identity: str, resource: NifiRegistryResourcePolicy, action: NifiRegistryResourcePolicyAction):
        try:
            NifiRegistryResourcePolicy.is_valid_enum_name(resource)
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            resource_policy = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                '',
                Service.NIFI_REGISTRY.value
            )

            for user_group in getattr(resource_policy, 'user_groups'):
                if getattr(user_group, 'identity') == user_group_identity:
                    raise ValueError(f'User group, {user_group_identity} already in {action.value} resource policy, {resource.value}. No action taken.')

            return nipyapi.security.add_user_group_to_access_policy(
                user_group_obj,
                resource_policy,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)

    def add_user_group_to_nifi_registry_bucket_policy(self, user_group_identity: str, bucket_name: str, action: NifiRegistryResourcePolicyAction):
        try:
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            bucket_policy = self._create_or_get_nifi_registry_bucket_policy(bucket_name, action, Intent.ADD_MEMBER)

            for user_group in getattr(bucket_policy, 'user_groups'):
                if getattr(user_group, 'identity') == user_group_identity:
                    raise ValueError(f'User group, {user_group_identity} already has {action.value} for, {bucket_name}. No action taken.')

            return nipyapi.security.add_user_group_to_access_policy(
                user_group_obj,
                bucket_policy,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_group(self, user_group_identity: str, service: Service):
        try:
            Service.is_valid_enum_name(service)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', service.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            return nipyapi.security.remove_service_user_group(user_group_obj, service.value)
        except Exception as e: 
            raise ValueError(e)

    def remove_user_group_from_nifi_access_policy(self, user_group_identity: str, resource: NifiAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            user_obj_is_member = False
            NifiAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI.value) is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            access_policy_obj = self._create_or_get_nifi_access_policy(resource, action, Intent.REMOVE_MEMBER)

            if access_policy_obj is None:
                raise ValueError(f'{action.value} access policy, {resource.value} does not exist. No action taken.')

            for user_group in getattr(getattr(access_policy_obj, 'component'), 'user_groups'):
                if getattr(getattr(user_group, 'component'), 'identity') == user_group_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User group, {user_group_identity} does not belong to {action.value} access policy, {resource.value}. No action taken.')

            access_policy_user_groups = getattr(getattr(access_policy_obj, 'component'), 'user_groups')
            filtered_access_policy_user_groups = [user for user in access_policy_user_groups if getattr(getattr(user, 'component'), 'identity') != user_group_identity]
            setattr(getattr(access_policy_obj, 'component'), 'user_groups', filtered_access_policy_user_groups)

            return nipyapi.security.update_access_policy(
                access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_group_from_nifi_process_group_access_policy(self, user_group_identity: str, process_group_name: str, resource: NifiProcessGroupAccessPolicyResource, action: NifiAccessPolicyAction):
        try:
            user_obj_is_member = False
            NifiProcessGroupAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI.value) is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            process_group_access_policy_obj = self._create_or_get_nifi_process_group_access_policy(
                process_group_name, 
                resource, 
                action, 
                Intent.REMOVE_MEMBER
            )

            if process_group_access_policy_obj is None:
                raise ValueError(f'{action.value} access policy, {resource.value} does not exist. No action taken.')

            for user_group in getattr(getattr(process_group_access_policy_obj, 'component'), 'user_groups'):
                if getattr(getattr(user_group, 'component'), 'identity') == user_group_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User group, {user_group_identity} does not belong to {action.value} access policy, {resource.value}. No action taken.')

            access_policy_user_groups = getattr(getattr(process_group_access_policy_obj, 'component'), 'user_groups')
            filtered_access_policy_user_groups = [user_group for user_group in access_policy_user_groups if getattr(getattr(user_group, 'component'), 'identity') != user_group_identity]
            setattr(getattr(process_group_access_policy_obj, 'component'), 'user_groups', filtered_access_policy_user_groups)

            return nipyapi.security.update_access_policy(
                process_group_access_policy_obj,
                Service.NIFI.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_group_from_nifi_registry_resource_policy(self, user_group_identity: str, resource: NifiRegistryResourcePolicy, action: NifiRegistryResourcePolicyAction):
        try:
            user_obj_is_member = False
            NifiRegistryResourcePolicy.is_valid_enum_name(resource)
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)

            if nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI_REGISTRY.value) is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            resource_policy_obj = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                '',
                Service.NIFI_REGISTRY.value
            )

            for user_group in getattr(resource_policy_obj, 'user_groups'):
                if getattr(user_group, 'identity') == user_group_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User group, {user_group_identity} does not belong to {action.value} resource policy, {resource.value}. No action taken.')

            resource_policy_user_groups = getattr(resource_policy_obj, 'user_groups')
            filtered_resource_policy_user_groups = [user_group for user_group in resource_policy_user_groups if getattr(user_group, 'identity') != user_group_identity]
            setattr(resource_policy_obj, 'user_groups', filtered_resource_policy_user_groups)

            return nipyapi.security.update_access_policy(
                resource_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_user_group_from_nifi_registry_bucket_policy(self, user_group_identity: str, bucket_name: str, action: NifiRegistryResourcePolicyAction):
        try:
            user_obj_is_member = False
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            user_group_obj = nipyapi.security.get_service_user_group(user_group_identity, 'identity', Service.NIFI_REGISTRY.value)

            if user_group_obj is None: 
                raise ValueError(f'User group, {user_group_identity} does not exist. No action taken.')

            bucket_policy_obj = self._create_or_get_nifi_registry_bucket_policy(bucket_name, action, Intent.REMOVE_MEMBER)

            if bucket_policy_obj is None:
                raise ValueError(f'{action.value} {bucket_name} bucket policy, does not exist. No action taken.')

            for user_group in getattr(bucket_policy_obj, 'user_groups'):
                if getattr(user_group, 'identity') == user_group_identity:
                    user_obj_is_member = True

            if user_obj_is_member == False:
                raise ValueError(f'User group, {user_group_identity} does not have {action.value} permission for {bucket_name}. No action taken.')

            bucket_policy_user_groups = getattr(bucket_policy_obj, 'user_groups')
            filtered_bucket_policy_user_groups = [user for user in bucket_policy_user_groups if getattr(user, 'identity') != user_group_identity]
            setattr(bucket_policy_obj, 'users', filtered_bucket_policy_user_groups)

            return nipyapi.security.update_access_policy(
                bucket_policy_obj,
                Service.NIFI_REGISTRY.value
            )
        except Exception as e: 
            raise ValueError(e)


    # Nifi and Nifi Registry Policies Management
    def _create_or_get_nifi_access_policy(self, resource: NifiAccessPolicyResource, action: NifiAccessPolicyAction, intent: Intent):
        try:
            NifiAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)
            Intent.is_valid_enum_name(intent)

            if (resource is NifiAccessPolicyResource.FLOW or resource is NifiAccessPolicyResource.PROVENANCE or resource is NifiAccessPolicyResource.SYSTEM_DIAGNOSTICS):
                action = NifiAccessPolicyAction.READ

            if resource is NifiAccessPolicyResource.PROXY_USER_REQUESTS:
                action = NifiAccessPolicyAction.WRITE

            access_policy_obj = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                '', 
                Service.NIFI.value
            )

            if access_policy_obj is None:
                if intent is Intent.ADD_MEMBER:
                    return nipyapi.security.create_access_policy(
                        resource.value, 
                        action.value, 
                        '',
                        Service.NIFI.value
                    )
                
                if intent is Intent.REMOVE_MEMBER:
                    return None

            return access_policy_obj
        except Exception as e: 
            raise ValueError(e)

    def _create_or_get_nifi_process_group_access_policy(self, process_group_name: str, resource: NifiProcessGroupAccessPolicyResource, action: NifiAccessPolicyAction, intent: Intent):
        try:
            NifiProcessGroupAccessPolicyResource.is_valid_enum_name(resource)
            NifiAccessPolicyAction.is_valid_enum_name(action)

            if resource is NifiProcessGroupAccessPolicyResource.VIEW_PROVENANCE:
                action = NifiAccessPolicyAction.READ

            if resource is NifiProcessGroupAccessPolicyResource.OPERATION_COMPONENT:
                action = NifiAccessPolicyAction.WRITE

            process_group_access_policy_obj = nipyapi.security.get_access_policy_for_resource(
                resource.value, 
                action.value, 
                Canvas().get_nifi_canvas_root_process_group_id() if process_group_name.upper() == 'ROOT' else Canvas().get_nifi_canvas_process_group_id(process_group_name), 
                Service.NIFI.value
            )

            if process_group_access_policy_obj is None:
                if intent is Intent.ADD_MEMBER:
                    return nipyapi.security.create_access_policy(
                        resource.value, 
                        action.value, 
                        Canvas().get_nifi_canvas_root_process_group_id() if process_group_name.upper() == 'ROOT' else Canvas().get_nifi_canvas_process_group_id(process_group_name),
                        Service.NIFI.value
                    )

                if intent is Intent.REMOVE_MEMBER:
                    return None

            return process_group_access_policy_obj
        except Exception as e: 
            raise ValueError(e)

    def _create_or_get_nifi_registry_bucket_policy(self, bucket_name: str, action: NifiRegistryResourcePolicyAction, intent: Intent):
        try:
            NifiRegistryResourcePolicyAction.is_valid_enum_name(action)
            Intent.is_valid_enum_name(intent)

            bucket = Versioning().get_nifi_registry_bucket(bucket_name)

            if bucket is None:
                raise ValueError(f'Bucket, {bucket_name} not found. No action taken.') 

            bucket_policy_obj = nipyapi.security.get_access_policy_for_resource(
                getattr(getattr(bucket, 'link'), 'href'), 
                action.value, 
                '',
                Service.NIFI_REGISTRY.value
            )

            return bucket_policy_obj
        except Exception as e: 
            if bucket is None:
                raise ValueError(e)

            if intent is Intent.ADD_MEMBER:
                return nipyapi.security.create_access_policy(
                    getattr(getattr(bucket, 'link'), 'href'),
                    action.value,
                    '',
                    Service.NIFI_REGISTRY.value
                )

            if intent is Intent.REMOVE_MEMBER:
                return None

