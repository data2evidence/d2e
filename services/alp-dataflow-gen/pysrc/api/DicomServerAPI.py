import requests
import os
import json
from typing import Dict
from orthanc_api_client import OrthancApiClient


class DicomServerAPI:
    def __init__(self):
        if os.getenv('DICOM_SERVER__API_BASE_URL') is None:
            raise ValueError("DICOM_SERVER__API_BASE_URL is undefined")
        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")
        self.url = os.getenv('DICOM_SERVER__API_BASE_URL')
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def get_uploaded_file_name(self, instance_id: str) -> str:
        url = f"{self.url}instances/{instance_id}"
        response = requests.get(
            url,
            verify=self.verifySsl,
        )
        if ((response.status_code >= 400) and (response.status_code < 600)):
            raise Exception(
                f"DicomServerAPI failed to return instance information, {response.content}")
        else:
            file_name = response.json()['FileUuid']
            return str(file_name) + ".dcm"
