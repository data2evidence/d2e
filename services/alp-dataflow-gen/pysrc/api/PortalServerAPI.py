import requests
import os


class PortalServerAPI:
    def __init__(self, token):
        if os.getenv('SYSTEM_PORTAL__API_URL') is None:
            raise ValueError("SYSTEM_PORTAL__API_URL is undefined")
        if os.getenv("PYTHON_VERIFY_SSL") == 'true' and os.getenv('TLS__INTERNAL__CA_CRT') is None:
            raise ValueError("TLS__INTERNAL__CA_CRT is undefined")
        self.datasets_url = os.getenv(
            'SYSTEM_PORTAL__API_URL') + 'dataset/list?role=systemAdmin'
        self.dataset_attributes_url = os.getenv(
            'SYSTEM_PORTAL__API_URL') + 'dataset/attribute'
        self.token = token
        self.verifySsl = False if os.getenv(
            "PYTHON_VERIFY_SSL") == 'false' else os.getenv('TLS__INTERNAL__CA_CRT')

    def getOptions(self):
        return {
            "Authorization": self.token
        }

    def get_datasets_from_portal(self):
        headers = self.getOptions()
        result = requests.get(
            self.datasets_url,
            headers=headers,
            verify=self.verifySsl
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"[{result.status_code}] PortalServerAPI Failed to retrieve datasets from portal")
        else:
            datasets_list = result.json()
            return datasets_list

    def update_dataset_attributes_table(self, study_id: str, attribute_id: str, attribute_value: str):
        headers = self.getOptions()
        result = requests.put(
            self.dataset_attributes_url,
            headers=headers,
            verify=self.verifySsl,
            json={"studyId": str(
                study_id), "attributeId": attribute_id, "value": attribute_value}
        )
        if ((result.status_code >= 400) and (result.status_code < 600)):
            raise Exception(
                f"[{result.status_code}] PortalServerAPI - Failed to update dataset attribute '{attribute_id}' for study '{study_id}'")
        else:
            return True
