import requests
import tempfile
from env import env


class UserMgmtAPI:
    def __init__(self, token):

        if env["PYTHON_VERIFY_SSL"] == 'true' and env["TLS__INTERNAL__CA_CRT"] is None:
            raise ValueError(
                "PYTHON_VERIFY_SSL is true but, TLS__INTERNAL__CA_CRT is undefined")

        # Parse SERVICE_ROUTES and get usermgmt
        self.url = env["SERVICE_ROUTES"]["usermgmt"]
        self.verifySsl = False if env["PYTHON_VERIFY_SSL"] == 'false' else env["TLS__INTERNAL__CA_CRT"]
        self.token = token

    def get_options(self):
        return {
            "Content-Type": "application/json",
            "Authorization": self.token
        }

    def get_user_allowed_dataset_ids(self, user_id: str) -> list[str]:
        '''
        Returns list of dataset ids that user has access to
        '''
        params = {
            "userId": user_id
        }

        result = requests.post(
            f"{self.url}/user-group/list",
            headers=self.get_options(),
            verify=self.verifySsl,
            json=params
        )
        return result.json()["alp_role_study_researcher"]
