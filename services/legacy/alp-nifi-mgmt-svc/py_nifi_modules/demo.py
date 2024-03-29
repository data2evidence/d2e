import os
from libs.canvas import Canvas

os.environ['NIFI__BASE_URL'] = 'https://localhost/nifi-api'
os.environ['NIFI__CA_CERT_PATH'] = './keys/LOCAL_NIFI_CA_CERT'
os.environ['NIFI__CERT_PATH'] = './keys/LOCAL_NIFI_CLIENT_CERT'
os.environ['NIFI__KEY_PATH'] = './keys/LOCAL_NIFI_CLIENT_KEY'

os.environ['NIFI_REGISTRY__BASE_URL'] = 'https://localhost:18083/nifi-registry-api'
os.environ['NIFI_REGISTRY__CA_CERT_PATH'] = './keys/LOCAL_NIFI_REGISTRY_CA_CERT'
os.environ['NIFI_REGISTRY__CERT_PATH'] = './keys/LOCAL_NIFI_REGISTRY_CLIENT_CERT'
os.environ['NIFI_REGISTRY__KEY_PATH'] = './keys/LOCAL_NIFI_REGISTRY_CLIENT_KEY'

print(Canvas().get_nifi_canvas_root_process_group_id())
