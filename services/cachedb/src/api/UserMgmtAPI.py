import requests
from config import Env


class UserMgmtAPI:
    def __init__(self, token):

        if Env.PYTHON_VERIFY_SSL == 'true' and Env.TLS__INTERNAL__CA_CRT is None:
            raise ValueError(
                "PYTHON_VERIFY_SSL is true but, TLS__INTERNAL__CA_CRT is undefined")

        # Parse SERVICE_ROUTES and get usermgmt
        self.url = Env.SERVICE_ROUTES["usermgmt"]
        self.verifySsl = False if Env.PYTHON_VERIFY_SSL == 'false' else Env.TLS__INTERNAL__CA_CRT
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
