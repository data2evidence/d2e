import nipyapi

from utils import config
from libs.controller import Controller
from libs.versioning import Versioning

class Canvas:
    def __init__(self):
        config.setup_nifi_config()

    # Manage Process Group
    def get_nifi_canvas_root_process_group_id(self):
        try:
            return nipyapi.canvas.get_root_pg_id()
        except Exception as e: 
            raise ValueError(e)

    def get_nifi_canvas_process_group_id(self, process_group_name: str):
        try:
            process_group_obj = nipyapi.canvas.get_process_group(process_group_name, 'name', False)

            if process_group_obj is None:
                raise ValueError(f'Process group, {process_group_name} not found. No action taken.')

            return getattr(getattr(process_group_obj, 'component'), 'id')
        except Exception as e: 
            raise ValueError(e)

    def remove_process_group_from_nifi_canvas(self, process_group_name: str):
        try:
            process_group_obj = nipyapi.canvas.get_process_group(process_group_name, 'name', False)

            if process_group_obj is None:
                raise ValueError(f'Process group, {process_group_name} not found. No action taken.')

            return nipyapi.canvas.delete_process_group(process_group_obj, False, True)
        except Exception as e: 
            raise ValueError(e)

    # Process Group Flow Deployment Management
    def deploy_latest_version_flow_to_nifi_canvas(self, registry_client_name: str, bucket_name: str, flow_name: str, process_group_name_to_deploy: str, canvas_location: tuple):
        try:
            registry_client_obj = Controller().get_nifi_registry_client_in_nifi(registry_client_name)

            if registry_client_obj is None:
                raise ValueError(f'Registry client, {registry_client_name} not found. No action taken.')

            flow_obj = Versioning().get_nifi_registry_flow_in_bucket(bucket_name, flow_name)

            if flow_obj is None:
                raise ValueError(f'Flow, {flow_name} not found in Nifi Registry {bucket_name} bucket. No action taken.')

            pg_id = Canvas().get_nifi_canvas_root_process_group_id() if process_group_name_to_deploy.upper() == 'ROOT' else self.get_nifi_canvas_process_group_id(process_group_name_to_deploy)
            flow_identifier = getattr(flow_obj, 'identifier')
            version_count = getattr(flow_obj, 'version_count')
            
            nipyapi.versioning.deploy_flow_version(
                pg_id, 
                canvas_location,
                getattr(flow_obj, 'bucket_identifier'),
                flow_identifier,
                getattr(getattr(registry_client_obj, 'component'), 'id'),
                version_count
            )

            return f'Version {version_count} of {bucket_name}/{flow_name}/{flow_identifier} successfully deployed!'
        except Exception as e:
            raise ValueError(e)

    def update_flow_version_in_nifi_canvas(self, process_group_name: str, target_version: int):
        try:
            process_group_obj = nipyapi.canvas.get_process_group(process_group_name, 'name', False)

            if process_group_obj is None:
                raise ValueError(f'Process group, {process_group_name} not found. No action taken.')

            return nipyapi.versioning.update_flow_ver(process_group_obj, target_version)
        except Exception as e: 
            raise ValueError(e)
