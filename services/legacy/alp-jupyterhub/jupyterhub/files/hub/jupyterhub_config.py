import os
import re
import sys
import urllib
import json
import jwt
import ssl

from kubernetes import client
from oauthenticator.azuread import AzureAdOAuthenticator
from tornado import gen, web
from tornado.auth import OAuth2Mixin
from tornado.log import app_log
from tornado.httpclient import HTTPRequest, AsyncHTTPClient

from jupyterhub.utils import url_path_join
from jupyterhub.apihandlers import APIHandler
from jupyterhub.apihandlers.users import admin_or_self


# Make sure that modules placed in the same directory as the jupyterhub config are added to the pythonpath
configuration_directory = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, configuration_directory)

from z2jh import get_config, set_config_if_not_none

# Configure JupyterHub to use the curl backend for making HTTP requests,
# rather than the pure-python implementations. The default one starts
# being too slow to make a large number of requests to the proxy API
# at the rate required.
AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")

from kubespawner.spawner import KubeSpawner

class MySpawner(KubeSpawner):
    def _notebook_dir_default(self):
        return '/home/jovyan/user'


# c.JupyterHub.spawner_class = 'kubespawner.KubeSpawner'
c.JupyterHub.spawner_class = MySpawner

# Connect to a proxy running in a different pod
c.ConfigurableHTTPProxy.api_url = 'http://{}:{}'.format(
    os.environ['PROXY_API_SERVICE_HOST'], int(os.environ['PROXY_API_SERVICE_PORT']))
c.ConfigurableHTTPProxy.should_start = False

# Do not shut down user pods when hub is restarted
c.JupyterHub.cleanup_servers = False

# Check that the proxy has routes appropriately setup
c.JupyterHub.last_activity_interval = 60

# Don't wait at all before redirecting a spawning user to the progress page
c.JupyterHub.tornado_settings = {
    'slow_spawn_timeout': 0,
}


def camelCaseify(s):
    """convert snake_case to camelCase

    For the common case where some_value is set from someValue
    so we don't have to specify the name twice.
    """
    return re.sub(r"_([a-z])", lambda m: m.group(1).upper(), s)


# configure the hub db connection
db_type = get_config('hub.db.type')
if db_type == 'sqlite-pvc':
    c.JupyterHub.db_url = "sqlite:///jupyterhub.sqlite"
elif db_type == "sqlite-memory":
    c.JupyterHub.db_url = "sqlite://"
else:
    setattr(c.JupyterHub, "db_url", open("/etc/jupyterhub/secret/hub.db.url", "r").readline())


for trait, cfg_key in (
    # Max number of servers that can be spawning at any one time
    ('concurrent_spawn_limit', None),
    # Max number of servers to be running at one time
    ('active_server_limit', None),
    # base url prefix
    ('base_url', None),
    ('allow_named_servers', None),
    ('named_server_limit_per_user', None),
    ('authenticate_prometheus', None),
    ('redirect_to_server', None),
    ('shutdown_on_logout', None),
    ('template_paths', None),
    ('template_vars', None),
):
    if cfg_key is None:
        cfg_key = camelCaseify(trait)
    set_config_if_not_none(c.JupyterHub, trait, 'hub.' + cfg_key)

c.JupyterHub.ip = os.environ['PROXY_PUBLIC_SERVICE_HOST']
c.JupyterHub.port = int(os.environ['PROXY_PUBLIC_SERVICE_PORT'])

# the hub should listen on all interfaces, so the proxy can access it
c.JupyterHub.hub_ip = '0.0.0.0'

# implement common labels
# this duplicates the jupyterhub.commonLabels helper
common_labels = c.KubeSpawner.common_labels = {}
common_labels['app'] = get_config(
    "nameOverride",
    default=get_config("Chart.Name", "jupyterhub"),
)
common_labels['heritage'] = "jupyterhub"
chart_name = get_config('Chart.Name')
chart_version = get_config('Chart.Version')
if chart_name and chart_version:
    common_labels['chart'] = "{}-{}".format(
        chart_name, chart_version.replace('+', '_'),
    )
release = get_config('Release.Name')
if release:
    common_labels['release'] = release

c.KubeSpawner.namespace = os.environ.get('POD_NAMESPACE', 'default')

# Max number of consecutive failures before the Hub restarts itself
# requires jupyterhub 0.9.2
set_config_if_not_none(
    c.Spawner,
    'consecutive_failure_limit',
    'hub.consecutiveFailureLimit',
)

for trait, cfg_key in (
    ('start_timeout', None),
    ('image_pull_policy', 'image.pullPolicy'),
    ('events_enabled', 'events'),
    ('extra_labels', None),
    ('extra_annotations', None),
    ('uid', None),
    ('fs_gid', None),
    ('service_account', 'serviceAccountName'),
    ('storage_extra_labels', 'storage.extraLabels'),
    ('tolerations', 'extraTolerations'),
    ('node_selector', None),
    ('node_affinity_required', 'extraNodeAffinity.required'),
    ('node_affinity_preferred', 'extraNodeAffinity.preferred'),
    ('pod_affinity_required', 'extraPodAffinity.required'),
    ('pod_affinity_preferred', 'extraPodAffinity.preferred'),
    ('pod_anti_affinity_required', 'extraPodAntiAffinity.required'),
    ('pod_anti_affinity_preferred', 'extraPodAntiAffinity.preferred'),
    ('lifecycle_hooks', None),
    ('init_containers', 'initContainers'),
    ('extra_containers', 'extraContainers'),
    ('mem_limit', 'memory.limit'),
    ('mem_guarantee', 'memory.guarantee'),
    ('cpu_limit', 'cpu.limit'),
    ('cpu_guarantee', 'cpu.guarantee'),
    ('extra_resource_limits', 'extraResource.limits'),
    ('extra_resource_guarantees', 'extraResource.guarantees'),
    ('environment', 'extraEnv'),
    ('profile_list', None),
    ('extra_pod_config', None),
):
    if cfg_key is None:
        cfg_key = camelCaseify(trait)
    set_config_if_not_none(c.KubeSpawner, trait, 'singleuser.' + cfg_key)

isD4LEnv = get_config("custom.isD4LEnv")

if isD4LEnv:
    c.KubeSpawner.image = f'{get_config("singleuser.image.d4lNexus.registry")}/{get_config("singleuser.image.repository")}:{get_config("singleuser.image.d4lNexus.tag")}'
    c.KubeSpawner.image_pull_secrets = get_config("singleuser.image.d4lNexus.pullSecrets")[0]
else:
    c.KubeSpawner.image = f'{get_config("singleuser.image.azureCR.registry")}/{get_config("singleuser.image.repository")}:{get_config("singleuser.image.azureCR.tag")}'
    c.KubeSpawner.image_pull_secrets = get_config("singleuser.image.azureCR.pullSecrets")[0]

# scheduling:
if get_config('scheduling.userScheduler.enabled'):
    c.KubeSpawner.scheduler_name = os.environ['HELM_RELEASE_NAME'] + "-user-scheduler"
if get_config('scheduling.podPriority.enabled'):
    c.KubeSpawner.priority_class_name = os.environ['HELM_RELEASE_NAME'] + "-default-priority"

# add node-purpose affinity
match_node_purpose = get_config('scheduling.userPods.nodeAffinity.matchNodePurpose')
if match_node_purpose:
    node_selector = dict(
        matchExpressions=[
            dict(
                key="hub.jupyter.org/node-purpose",
                operator="In",
                values=["user"],
            )
        ],
    )
    if match_node_purpose == 'prefer':
        c.KubeSpawner.node_affinity_preferred.append(
            dict(
                weight=100,
                preference=node_selector,
            ),
        )
    elif match_node_purpose == 'require':
        c.KubeSpawner.node_affinity_required.append(node_selector)
    elif match_node_purpose == 'ignore':
        pass
    else:
        raise ValueError("Unrecognized value for matchNodePurpose: %r" % match_node_purpose)

# add dedicated-node toleration
for key in (
    'hub.jupyter.org/dedicated',
    # workaround GKE not supporting / in initial node taints
    'hub.jupyter.org_dedicated',
):
    c.KubeSpawner.tolerations.append(
        dict(
            key=key,
            operator='Equal',
            value='user',
            effect='NoSchedule',
        )
    )

# Configure dynamically provisioning pvc
storage_type = get_config('singleuser.storage.type')

if storage_type == 'dynamic':
    pvc_name_template = get_config('singleuser.storage.dynamic.pvcNameTemplate')
    c.KubeSpawner.pvc_name_template = pvc_name_template
    volume_name_template = get_config('singleuser.storage.dynamic.volumeNameTemplate')
    c.KubeSpawner.storage_pvc_ensure = True
    set_config_if_not_none(c.KubeSpawner, 'storage_class',
                           'singleuser.storage.dynamic.storageClass')
    set_config_if_not_none(c.KubeSpawner, 'storage_access_modes',
                           'singleuser.storage.dynamic.storageAccessModes')
    set_config_if_not_none(c.KubeSpawner, 'storage_capacity', 'singleuser.storage.capacity')

    # Add volumes to singleuser pods
    c.KubeSpawner.volumes = [
        {
            'name': volume_name_template,
            'persistentVolumeClaim': {
                'claimName': pvc_name_template
            }
        },
        {
            'name': 'tls',
            'secret': {
                'secretName': 'tls-secrets',
            }
        },
        {
            'name': 'swift',
            'secret': {
                'secretName': 'swift-secrets',
            }
        }
    ]
    c.KubeSpawner.volume_mounts = [
        {
            'mountPath': get_config('singleuser.storage.homeMountPath'),
            'name': volume_name_template
        }
    ]

    # Add volumes to post docker containers
    for container in c.KubeSpawner.extra_containers:
        if "image" not in container:  # If image property is not defined already
            if isD4LEnv:
                container["image"] = f'{get_config("singleuser.image.d4lNexus.registry")}/{container["repository"]}:{get_config("singleuser.image.d4lNexus.tag")}'
            else:
                container["image"] = f'{get_config("singleuser.image.azureCR.registry")}/{container["repository"]}:{get_config("singleuser.image.azureCR.tag")}'

        del container["repository"]  # Incase the repository was defined, It needs to be removed

        container["volumeMounts"] = [
            {
                'mountPath': get_config('singleuser.storage.homeMountPath'),
                'name': volume_name_template
            }
        ]
        if container["name"] == "files-backup":
            container["volumeMounts"].append(
                {
                    'mountPath': "/var/swift",
                    'name': "swift"
                }
            )
            container["securityContext"] = {
                'runAsGroup': 3000,
                'runAsUser': 3000,
                'allowPrivilegeEscalation': False
            }
            alpSystemIdEnvObj = {
                "name": "ALP_SYSTEM_ID",
                "value": get_config('custom.alpSystemId')
            }
            if "env" not in container:
                container["env"] = [alpSystemIdEnvObj]
            else:
                container["env"].append(alpSystemIdEnvObj)
        else:
            container["securityContext"] = {
                'runAsGroup': 100,
                'runAsUser': 1000,
                'allowPrivilegeEscalation': False
            }

    for container in c.KubeSpawner.init_containers:
        container["env"] = [
            {
                "name": "CERT_HOSTNAME",
                "value": get_config('custom.hostname')
            }
        ]
        container["volumeMounts"] = [
            {
                'mountPath': get_config('singleuser.storage.homeMountPath'),
                'name': volume_name_template
            },
            {
                'mountPath': "/tls-tmp/proxy-client-ca/proxy-client-ca.crt",
                'name': "tls",
                'subPath': "JHUB_CLIENT_CA_CERT"
            },
            {
                'mountPath': "/tls-tmp/jhub-ca_trust.crt",
                'name': "tls",
                'subPath': "JHUB_CA_CERT_TRUST"
            },
            {
                'mountPath': "/tls-tmp/proxy-client-ca/proxy-client-ca.key",
                'name': "tls",
                'subPath': "JHUB_CLIENT_CA_KEY"
            },
            {
                'mountPath': "/tls-tmp/mri-app-router-ca-root-cert.pem",
                'name': "tls",
                'subPath': "JHUB_MRI_APP_ROUTER_CA_ROOT_CERT"
            },
        ]
        container["securityContext"] = {
            'runAsGroup': 100,
            'runAsUser': 1000,
            'allowPrivilegeEscalation': False
        }

elif storage_type == 'static':
    pvc_claim_name = get_config('singleuser.storage.static.pvcName')
    c.KubeSpawner.volumes = [{
        'name': 'home',
        'persistentVolumeClaim': {
            'claimName': pvc_claim_name
        }
    }]

    c.KubeSpawner.volume_mounts = [{
        'mountPath': get_config('singleuser.storage.homeMountPath'),
        'name': 'home',
        'subPath': get_config('singleuser.storage.static.subPath')
    }]

c.KubeSpawner.volumes.extend(get_config('singleuser.storage.extraVolumes', []))
c.KubeSpawner.volume_mounts.extend(get_config('singleuser.storage.extraVolumeMounts', []))

# Gives spawned containers access to the API of the hub
c.JupyterHub.hub_connect_ip = os.environ['HUB_SERVICE_HOST']
c.JupyterHub.hub_connect_port = int(os.environ['HUB_SERVICE_PORT'])

# Allow switching authenticators easily
auth_type = get_config('auth.type')
email_domain = 'local'

common_oauth_traits = (
    ('client_id', None),
    ('client_secret', None),
    ('oauth_callback_url', 'callbackUrl'),
)

if auth_type == 'google':
    c.JupyterHub.authenticator_class = 'oauthenticator.GoogleOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('hosted_domain', None),
        ('login_service', None),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.GoogleOAuthenticator, trait, 'auth.google.' + cfg_key)
    email_domain = get_config('auth.google.hostedDomain')
elif auth_type == 'github':
    c.JupyterHub.authenticator_class = 'oauthenticator.github.GitHubOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('github_organization_whitelist', 'orgWhitelist'),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.GitHubOAuthenticator, trait, 'auth.github.' + cfg_key)
elif auth_type == 'cilogon':
    c.JupyterHub.authenticator_class = 'oauthenticator.CILogonOAuthenticator'
    for trait, cfg_key in common_oauth_traits:
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.CILogonOAuthenticator, trait, 'auth.cilogon.' + cfg_key)
elif auth_type == 'gitlab':
    c.JupyterHub.authenticator_class = 'oauthenticator.gitlab.GitLabOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('gitlab_group_whitelist', None),
        ('gitlab_project_id_whitelist', None),
        ('gitlab_url', None),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.GitLabOAuthenticator, trait, 'auth.gitlab.' + cfg_key)
elif auth_type == 'azuread':
    c.JupyterHub.authenticator_class = 'oauthenticator.azuread.AzureAdOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('tenant_id', None),
        ('username_claim', None),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)

        set_config_if_not_none(c.AzureAdOAuthenticator, trait, 'auth.azuread.' + cfg_key)
elif auth_type == 'mediawiki':
    c.JupyterHub.authenticator_class = 'oauthenticator.mediawiki.MWOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('index_url', None),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.MWOAuthenticator, trait, 'auth.mediawiki.' + cfg_key)
elif auth_type == 'globus':
    c.JupyterHub.authenticator_class = 'oauthenticator.globus.GlobusOAuthenticator'
    for trait, cfg_key in common_oauth_traits + (
        ('identity_provider', None),
    ):
        if cfg_key is None:
            cfg_key = camelCaseify(trait)
        set_config_if_not_none(c.GlobusOAuthenticator, trait, 'auth.globus.' + cfg_key)
elif auth_type == 'hmac':
    c.JupyterHub.authenticator_class = 'hmacauthenticator.HMACAuthenticator'
    c.HMACAuthenticator.secret_key = bytes.fromhex(get_config('auth.hmac.secretKey'))
elif auth_type == 'dummy':
    c.JupyterHub.authenticator_class = 'dummyauthenticator.DummyAuthenticator'
    set_config_if_not_none(c.DummyAuthenticator, 'password', 'auth.dummy.password')
elif auth_type == 'tmp':
    c.JupyterHub.authenticator_class = 'tmpauthenticator.TmpAuthenticator'
elif auth_type == 'lti':
    c.JupyterHub.authenticator_class = 'ltiauthenticator.LTIAuthenticator'
    set_config_if_not_none(c.LTIAuthenticator, 'consumers', 'auth.lti.consumers')
elif auth_type == 'ldap':
    c.JupyterHub.authenticator_class = 'ldapauthenticator.LDAPAuthenticator'
    c.LDAPAuthenticator.server_address = get_config('auth.ldap.server.address')
    set_config_if_not_none(c.LDAPAuthenticator, 'server_port', 'auth.ldap.server.port')
    set_config_if_not_none(c.LDAPAuthenticator, 'use_ssl', 'auth.ldap.server.ssl')
    set_config_if_not_none(c.LDAPAuthenticator, 'allowed_groups', 'auth.ldap.allowedGroups')
    set_config_if_not_none(c.LDAPAuthenticator, 'bind_dn_template', 'auth.ldap.dn.templates')
    set_config_if_not_none(c.LDAPAuthenticator, 'lookup_dn', 'auth.ldap.dn.lookup')
    set_config_if_not_none(c.LDAPAuthenticator, 'lookup_dn_search_filter',
                           'auth.ldap.dn.search.filter')
    set_config_if_not_none(c.LDAPAuthenticator, 'lookup_dn_search_user',
                           'auth.ldap.dn.search.user')
    set_config_if_not_none(c.LDAPAuthenticator, 'lookup_dn_search_password',
                           'auth.ldap.dn.search.password')
    set_config_if_not_none(c.LDAPAuthenticator, 'lookup_dn_user_dn_attribute',
                           'auth.ldap.dn.user.dnAttribute')
    set_config_if_not_none(c.LDAPAuthenticator, 'escape_userdn', 'auth.ldap.dn.user.escape')
    set_config_if_not_none(c.LDAPAuthenticator, 'valid_username_regex',
                           'auth.ldap.dn.user.validRegex')
    set_config_if_not_none(c.LDAPAuthenticator, 'user_search_base', 'auth.ldap.dn.user.searchBase')
    set_config_if_not_none(c.LDAPAuthenticator, 'user_attribute', 'auth.ldap.dn.user.attribute')
elif auth_type == 'custom':
    # full_class_name looks like "myauthenticator.MyAuthenticator".
    # To create a docker image with this class availabe, you can just have the
    # following Dockerfile:
    #   FROM jupyterhub/k8s-hub:v0.4
    #   RUN pip3 install myauthenticator
    full_class_name = get_config('auth.custom.className')

    class CustomAzureAdOAuthenticator(AzureAdOAuthenticator):
        async def authenticate(self, handler, data=None):
            code = handler.get_argument("code")
            http_client = AsyncHTTPClient()

            params = dict(
                client_id=self.client_id,
                client_secret=self.client_secret,
                grant_type='authorization_code',
                code=code,
                redirect_uri=self.get_callback_url(handler))

            data = urllib.parse.urlencode(
                params, doseq=True, encoding='utf-8', safe='=')

            url = self.token_url

            headers = {
                'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8'
            }

            context = ssl.create_default_context()
            context.load_verify_locations("/srv/jupyterhub/tls-ca/digicert-ca_trust.crt")

            req = HTTPRequest(
                url,
                method="POST",
                ssl_options=context,
                headers=headers,
                body=data,  # Body is required for a POST...
            )

            resp = await http_client.fetch(req)
            resp_json = json.loads(resp.body.decode('utf8', 'replace'))
            # app_log.info("Response %s", resp_json)
            access_token = resp_json['access_token']
            refresh_token = resp_json['refresh_token']
            id_token = resp_json['id_token']
            decoded = jwt.decode(id_token, verify=True)
            userdict = {"name": decoded[self.username_claim]}
            userdict["auth_state"] = auth_state = {}
            auth_state['access_token'] = access_token
            auth_state['refresh_token'] = refresh_token
            auth_state['id_token'] = id_token
            # results in a decoded JWT for the user data
            auth_state['user'] = decoded

            return userdict

        @gen.coroutine
        def pre_spawn_start(self, user, spawner):
            print(user)
            auth_state = yield user.get_auth_state()
            if not auth_state:
                # user has no auth state
                return
            # define some environment variables from auth_state
            # print(auth_state)
            spawner.environment['OIDC_ACCESS_TOKEN'] = auth_state['access_token']
            spawner.environment['OIDC_REFRESH_TOKEN'] = auth_state['refresh_token']
            spawner.environment['OIDC_ID_TOKEN'] = auth_state['id_token']

    c.JupyterHub.authenticator_class = CustomAzureAdOAuthenticator
    auth_class_name = full_class_name.rsplit('.', 1)[-1]
    #auth_config = c[auth_class_name]
    # Need to persist auth state in database.
    c.CustomAzureAdOAuthenticator.enable_auth_state = True
    c.CustomAzureAdOAuthenticator.tenant_id = os.environ.get('AAD_TENANT_ID')
    c.CustomAzureAdOAuthenticator.client_id = os.environ.get('OAUTH_CLIENT_ID')
    c.CustomAzureAdOAuthenticator.client_secret = os.environ.get('OAUTH_CLIENT_SECRET')
    c.CustomAzureAdOAuthenticator.token_url = os.environ.get('OAUTH2_TOKEN_URL')
    c.CustomAzureAdOAuthenticator.authorize_url = os.environ.get('OAUTH2_AUTHORIZE_URL')
    #auth_config.update(get_config('auth.custom.config') or {})

else:
    raise ValueError("Unhandled auth type: %r" % auth_type)

set_config_if_not_none(c.OAuthenticator, 'scope', 'auth.scopes')

set_config_if_not_none(c.Authenticator, 'enable_auth_state', 'auth.state.enabled')

# Enable admins to access user servers
set_config_if_not_none(c.JupyterHub, 'admin_access', 'auth.admin.access')
set_config_if_not_none(c.Authenticator, 'admin_users', 'auth.admin.users')
set_config_if_not_none(c.Authenticator, 'whitelist', 'auth.whitelist.users')

c.JupyterHub.services = []


class RefreshTokenHandler(APIHandler):

    @admin_or_self
    async def post(self, name):
        """"""
        user = self.find_user(name)
        if not user:
            raise web.HTTPError(404, "No such user: %s" % name)

        body = self.get_json_body()
        if not isinstance(body, dict):
            raise web.HTTPError(400, "body must be a json dict")

        http_client = AsyncHTTPClient()

        params = dict(
            client_id=os.environ.get('OAUTH_CLIENT_ID'),
            client_secret=os.environ.get('OAUTH_CLIENT_SECRET'),
            scope=f'offline_access {os.environ.get("OAUTH_CLIENT_ID")}',
            grant_type='refresh_token',
            refresh_token=body.get('refresh_token'),
            redirect_uri=os.environ.get("OAUTH_CALLBACK_URL"))

        data = urllib.parse.urlencode(
            params, doseq=True, encoding='utf-8', safe='=')

        url = os.environ["OAUTH2_TOKEN_URL"]

        headers = {
            'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8'
        }

        context = ssl.create_default_context()
        context.load_verify_locations("/srv/jupyterhub/tls-ca/digicert-ca_trust.crt")

        req = HTTPRequest(
            url,
            method="POST",
            headers=headers,
            body=data,
            ssl_options=context,
        )

        resp = await http_client.fetch(req)
        resp_json = json.loads(resp.body.decode('utf8', 'replace'))

        # app_log.info("Response %s", resp_json)
        user_auth_state = {
            'access_token': resp_json['access_token'],
            'refresh_token': resp_json['refresh_token'],
            'id_token': resp_json['id_token']
        }

        user = jwt.decode(user_auth_state["id_token"], verify=True)
        app_log.info(f"OAuth Tokens refreshed successfully for User {user['email']}")

        self.write(json.dumps(user_auth_state))


c.JupyterHub.extra_handlers = [(r"/api/users/([^/]+)/token/refresh", RefreshTokenHandler)]

c.JupyterHub.trusted_alt_names = [
    f'DNS:{os.environ["CERT_HOSTNAME"]}', f'IP:{os.environ["HUB_SERVICE_HOST"]}']
c.JupyterHub.internal_ssl = True
# c.JupyterHub.generate_certs = False
c.JupyterHub.internal_certs_location = "internal-ssl"
c.JupyterHub.recreate_internal_certs = True
c.JupyterHub.external_ssl_authorities = {
    "hub-ca": {
        'key': '/srv/jupyterhub/tls-ca/hub-ca/hub-ca.key',
        'cert': '/srv/jupyterhub/tls-ca/hub-ca/hub-ca.crt',
        'ca': '/srv/jupyterhub/tls-ca/hub-ca_trust.crt'
    },
    "proxy-client-ca": {
        'key': '/srv/jupyterhub/tls-ca/proxy-client-ca/proxy-client-ca.key',
        'cert': '/srv/jupyterhub/tls-ca/proxy-client-ca/proxy-client-ca.crt',
        'ca': '/srv/jupyterhub/tls-ca/hub-ca_trust.crt'
    },
    "azure-ca": {
        'ca': '/srv/jupyterhub/tls-ca/digicert-ca_trust.crt'
    }
}

if get_config('cull.enabled', False):
    cull_cmd = [
        'python3',
        '/etc/jupyterhub/cull_idle_servers.py',
    ]
    base_url = c.JupyterHub.get('base_url', '/')
    cull_cmd.append(
        '--url=https://127.0.0.1:8081' + url_path_join(base_url, 'hub/api')
    )

    cull_timeout = get_config('cull.timeout')
    if cull_timeout:
        cull_cmd.append('--timeout=%s' % cull_timeout)

    cull_every = get_config('cull.every')
    if cull_every:
        cull_cmd.append('--cull-every=%s' % cull_every)

    cull_concurrency = get_config('cull.concurrency')
    if cull_concurrency:
        cull_cmd.append('--concurrency=%s' % cull_concurrency)

    if get_config('cull.users'):
        cull_cmd.append('--cull-users')

    if get_config('cull.removeNamedServers'):
        cull_cmd.append('--remove-named-servers')

    cull_max_age = get_config('cull.maxAge')
    if cull_max_age:
        cull_cmd.append('--max-age=%s' % cull_max_age)

    c.JupyterHub.services.append({
        'name': 'cull-idle',
        'admin': True,
        'command': cull_cmd,
    })

for name, service in get_config('hub.services', {}).items():
    # jupyterhub.services is a list of dicts, but
    # in the helm chart it is a dict of dicts for easier merged-config
    service.setdefault('name', name)
    # handle camelCase->snake_case of api_token
    api_token = service.pop('apiToken', None)
    if api_token:
        service['api_token'] = api_token
    c.JupyterHub.services.append(service)


set_config_if_not_none(c.Spawner, 'cmd', 'singleuser.cmd')
set_config_if_not_none(c.Spawner, 'default_url', 'singleuser.defaultUrl')

cloud_metadata = get_config('singleuser.cloudMetadata', {})

if not cloud_metadata.get('enabled', False):
    # Use iptables to block access to cloud metadata by default
    network_tools_image_name = get_config('singleuser.networkTools.image.name')
    network_tools_image_tag = get_config('singleuser.networkTools.image.tag')
    ip_block_container = client.V1Container(
        name="block-cloud-metadata",
        image=f"{network_tools_image_name}:{network_tools_image_tag}",
        command=[
            'iptables',
            '-A', 'OUTPUT',
            '-d', cloud_metadata.get('ip', '169.254.169.254'),
            '-j', 'DROP'
        ],
        security_context=client.V1SecurityContext(
            privileged=True,
            run_as_user=0,
            capabilities=client.V1Capabilities(add=['NET_ADMIN'])
        )
    )

    c.KubeSpawner.init_containers.append(ip_block_container)

if get_config('debug.enabled', False):
    c.JupyterHub.log_level = 'DEBUG'
    c.Spawner.debug = True


extra_config = get_config('hub.extraConfig', {})
if isinstance(extra_config, str):
    from textwrap import indent, dedent
    msg = dedent(
        """
    hub.extraConfig should be a dict of strings,
    but found a single string instead.

    extraConfig as a single string is deprecated
    as of the jupyterhub chart version 0.6.

    The keys can be anything identifying the
    block of extra configuration.

    Try this instead:

        hub:
          extraConfig:
            myConfig: |
              {}

    This configuration will still be loaded,
    but you are encouraged to adopt the nested form
    which enables easier merging of multiple extra configurations.
    """
    )
    print(
        msg.format(
            indent(extra_config, ' ' * 10).lstrip()
        ),
        file=sys.stderr
    )
    extra_config = {'deprecated string': extra_config}

for key, config_py in sorted(extra_config.items()):
    print("Loading extra config: %s" % key)
    exec(config_py)
