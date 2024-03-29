import nipyapi

from utils import config
from utils.enum_types import Service

class Controller:
    def __init__(self):
        config.setup_nifi_config()

    # Registry Client Management
    def get_nifi_registry_client_list_in_nifi(self):
        try:
            return nipyapi.versioning.list_registry_clients()
        except Exception as e: 
            raise ValueError(e)

    def get_nifi_registry_client_in_nifi(self, registry_client_name: str):
        try:
            registry_clients = self.get_nifi_registry_client_list_in_nifi()
            registry_clients = [client for client in getattr(registry_clients, 'registries') if getattr(getattr(client, 'component'), 'name') == registry_client_name]

            if registry_clients == []:
                return None

            return registry_clients[0]
        except Exception as e: 
            raise ValueError(e)

    def create_nifi_registry_client_in_nifi(self, name: str, uri: str, description: str):
        try:
            return nipyapi.versioning.create_registry_client(name, uri, description)
        except Exception as e: 
            raise ValueError(e)

    def update_nifi_registry_client_name_in_nifi(self, registry_client_name: str, new_registry_client_name: str):
        try:
            if registry_client_name == new_registry_client_name:
                raise ValueError(f'Current registry client name, {registry_client_name} and new registry client name, {new_registry_client_name} are exactly the same. No action taken.')

            registry_client_obj = self.get_nifi_registry_client_in_nifi(registry_client_name)

            if registry_client_obj is None: 
                raise ValueError(f'Registry client, {registry_client_name} does not exist. No action taken.')

            setattr(getattr(registry_client_obj, 'component'), 'name', new_registry_client_name)

            return getattr(nipyapi, Service.NIFI.value).ControllerApi().update_registry_client(
                getattr(registry_client_obj, 'id'), 
                registry_client_obj    
            )
        except Exception as e: 
            raise ValueError(e)

    def update_nifi_registry_client_uri_in_nifi(self, registry_client_name: str, new_registry_client_uri: str):
        try:
            registry_client_obj = self.get_nifi_registry_client_in_nifi(registry_client_name)

            if registry_client_obj is None: 
                raise ValueError(f'Registry client, {registry_client_name} does not exist. No action taken.')

            if getattr(getattr(registry_client_obj, 'component'), 'uri') == new_registry_client_uri:
                raise ValueError(f'Current registry client uri and new registry client uri, {new_registry_client_uri} are exactly the same. No action taken.')

            setattr(getattr(registry_client_obj, 'component'), 'uri', new_registry_client_uri)

            return getattr(nipyapi, Service.NIFI.value).ControllerApi().update_registry_client(
                getattr(registry_client_obj, 'id'), 
                registry_client_obj    
            )
        except Exception as e: 
            raise ValueError(e)

    def update_nifi_registry_client_description_in_nifi(self, registry_client_name: str, new_registry_client_description: str):
        try:
            registry_client_obj = self.get_nifi_registry_client_in_nifi(registry_client_name)

            if registry_client_obj is None: 
                raise ValueError(f'Registry client, {registry_client_name} does not exist. No action taken.')

            if getattr(getattr(registry_client_obj, 'component'), 'description') == new_registry_client_description:
                raise ValueError(f'Current registry client description and new registry client description, {new_registry_client_description} are exactly the same. No action taken.')

            setattr(getattr(registry_client_obj, 'component'), 'description', new_registry_client_description)

            return getattr(nipyapi, Service.NIFI.value).ControllerApi().update_registry_client(
                getattr(registry_client_obj, 'id'), 
                registry_client_obj    
            )
        except Exception as e: 
            raise ValueError(e)

    def remove_nifi_registry_client_in_nifi(self, registry_client_name: str):
        try:
            registry_client_obj = self.get_nifi_registry_client_in_nifi(registry_client_name)

            if registry_client_obj is None: 
                raise ValueError(f'Registry client, {registry_client_name} does not exist. No action taken.')

            return nipyapi.versioning.delete_registry_client(registry_client_obj)
        except Exception as e: 
            raise ValueError(e)

