import nipyapi

from utils import config

class Versioning:
    def __init__(self):
        config.setup_nifi_registry_config()

    # Manage Bucket 
    def get_nifi_registry_bucket(self, bucket_name: str):
        try:
            buckets = nipyapi.versioning.get_registry_bucket('', 'name')
            buckets = [bucket for bucket in buckets if getattr(bucket, 'name') == bucket_name]

            if buckets == []:
                raise ValueError(f'Bucket, {bucket_name} does not exist.')

            return buckets[0]
        except Exception as e: 
            raise ValueError(e)

    # Manage Bucket Flow
    def get_nifi_registry_flow_list_in_bucket(self, bucket_name: str):
        try:
            bucket_obj = self.get_nifi_registry_bucket(bucket_name)
            return nipyapi.versioning.list_flows_in_bucket(getattr(bucket_obj, 'identifier'))
        except Exception as e:
            raise ValueError(e)

    def get_nifi_registry_flow_in_bucket(self, bucket_name: str, flow_name: str):
        try:
            flows = self.get_nifi_registry_flow_list_in_bucket(bucket_name)
            flows = [flow for flow in flows if getattr(flow, 'name') == flow_name]
            
            if flows == []:
                raise ValueError(f'Flow, {flow_name} does not exist.')

            return flows[0]
        except Exception as e: 
            raise ValueError(e)

