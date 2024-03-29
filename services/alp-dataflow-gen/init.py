import os
from prefect.filesystems import RemoteFileSystem as RFS

def create_dataflow_adhoc_flows_dir(): 
    sb_name = os.getenv('DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_SB_NAME')
    s3_dir_path = os.getenv('DATAFLOW_MGMT__ADHOC_FLOWS__S3_DIR_PATH')
    s3_access_key = os.getenv('MINIO__ACCESS_KEY')
    s3_secret_key = os.getenv('MINIO__SECRET_KEY')
    s3_port = os.getenv('MINIO__PORT')
    s3_hostname = os.getenv('MINIO__ENDPOINT')
    url = f'http://{s3_hostname}:{s3_port}'
    block = RFS(
        basepath=s3_dir_path,
        settings={
            "key": s3_access_key,
            "secret": s3_secret_key,
            "client_kwargs": {"endpoint_url": url},
        },
    )
    block.save(sb_name, overwrite=True)

create_dataflow_adhoc_flows_dir()