from minio import Minio
import os
import pandas as pd
from io import BytesIO


class MinioDao():
    def __init__(self):
        minio_endpoint = os.getenv("MINIO__ENDPOINT")
        minio_port = os.getenv("MINIO__PORT")
        minio_secret_key = os.getenv("MINIO__SECRET_KEY")
        minio_access_key = os.getenv("MINIO__ACCESS_KEY")
        minio_region = os.getenv("MINIO__REGION")
        minio_ssl = True if os.getenv("MINIO__SSL") == "true" else False

        self.minio_region = minio_region
        self.client = Minio(
            f"{minio_endpoint}:{minio_port}",
            access_key=minio_access_key,
            secret_key=minio_secret_key,
            region=minio_region,
            secure=minio_ssl
        )

    def put_dataframe_as_parquet(self, bucket_name: str, file_name: str, df: pd.DataFrame):
        # Convert dataframe to parquet and buffer
        bytes_data = df.to_parquet(file_name, engine='pyarrow')
        buffer = BytesIO(bytes_data)

        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name, self.minio_region)

        self.client.put_object(bucket_name, file_name,
                               buffer, - 1, part_size=10*1024*1024)
