
-- Seed Apps
INSERT INTO public.applications(
	tenant_id, id, name, secret, description, type, oidc_client_metadata, custom_client_metadata, created_at)
	VALUES ('default', '1d6wuydanyaiypbkchxzu', 'alp-app', 'yFRvkJg8NKXx3phL27QembSa4ZHzcVD5', 'alp-app', 'Traditional', '{  "redirectUris": [    "https://localhost:41100/portal/login-callback", "https://localhost:4000/portal/login-callback", "https://localhost:8081"  ],  "postLogoutRedirectUris": [    "https://localhost:41100/portal", "https://localhost:4000/portal", "https://localhost:8081"  ] }', '{  "corsAllowedOrigins": [],   "rotateRefreshToken": true,   "refreshTokenTtlInDays": 14,   "alwaysIssueRefreshToken": true }', CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE
	SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata;


INSERT INTO public.applications(
	tenant_id, id, name, secret, description, type, oidc_client_metadata, custom_client_metadata, created_at)
	VALUES ('default', 'a560o8tqw79hy2cpn8x1q', 'alp-admin', 'xk8HP4VDzqJcnXCTpdaQM6Ut2SwrG37u', 'alp-admin', 'MachineToMachine', '{  "redirectUris": [],  "postLogoutRedirectUris": [] }', '{}', CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE
	SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata;

INSERT INTO public.applications(
	tenant_id, id, name, secret, description, type, oidc_client_metadata, custom_client_metadata, created_at)
	VALUES ('default', '6q6a13bg3dw6fncdr2kf6', 'alp-svc', 'YEuzmvJfsWMHwFV7hSB5P9p8ky2Gqdxn', 'alp-svc', 'MachineToMachine', '{  "redirectUris": [],  "postLogoutRedirectUris": [] }', '{}', CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE
	SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata;

INSERT INTO public.applications(
	tenant_id, id, name, secret, description, type, oidc_client_metadata, custom_client_metadata, created_at)
	VALUES ('default', 't5vwuno8ckh5hmqozjqyj', 'alp-data', 'esgCzGT7d6AREhWqyLY9fxb4wX8auMpZ', 'alp-data', 'MachineToMachine', '{  "redirectUris": [],  "postLogoutRedirectUris": [] }', '{}', CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE
	SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata;

-- API Resources
INSERT INTO public.resources(
	tenant_id, id, name, indicator, is_default, access_token_ttl)
	VALUES ('default', '48dbzxpqllljpy4nv41h6', 'alp-default', 'https://alp-default', true, 3600)
	ON CONFLICT(id) 
	DO NOTHING;

-- Roles
INSERT INTO public.roles(
	tenant_id, id, name, description, type)
	VALUES ('default', 'jrmtgmb34iznwqdu5dhl1', 'api-access', 'Logto API access', 'MachineToMachine')
	ON CONFLICT(id) 
	DO NOTHING;

-- Application-roles assignment
INSERT INTO public.applications_roles(
	tenant_id, id, application_id, role_id)
	VALUES ('default', '34vzakbak1tp830d0s30o', 'a560o8tqw79hy2cpn8x1q', 'jrmtgmb34iznwqdu5dhl1')
	ON CONFLICT(id) 
	DO NOTHING;

-- roles-scopes assignment
INSERT INTO public.roles_scopes(
	tenant_id, id, role_id, scope_id)
	VALUES ('default', 'da9va7i1g6ojghbph104e', 'jrmtgmb34iznwqdu5dhl1', 'management-api-all')
	ON CONFLICT(id)
	DO NOTHING;

-- Users
INSERT INTO public.users(
	tenant_id, id, username, primary_email, password_encrypted, password_encryption_method, application_id, is_suspended, last_sign_in_at, created_at)
	VALUES ('default', 'hs2gl1yng81j', 'admin', null, '$argon2i$v=19$m=4096,t=256,p=1$gFXKgnc0tFywI7DcRVN+Tg$c0TeMUiDq6PMCLyJmR/V/sb1MV8MpMBeRy24+ZsZgeY', 'Argon2i', null, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	ON CONFLICT(id)
	DO NOTHING;

-- Scopes for Default API resource
INSERT INTO public.scopes(
	tenant_id, id, resource_id, name, description, created_at)
	VALUES ('default', 'zx2438Lt9AReSVmqbNMsB', '48dbzxpqllljpy4nv41h6', 'role.systemadmin', 'ALP System admin', CURRENT_TIMESTAMP)
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.scopes(
	tenant_id, id, resource_id, name, description, created_at)
	VALUES ('default', 'SPRkhWzbDLy4sUXEvgYVM', '48dbzxpqllljpy4nv41h6', 'role.useradmin', 'ALP User admin', CURRENT_TIMESTAMP)
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.scopes(
	tenant_id, id, resource_id, name, description, created_at)
	VALUES ('default', 'eC9DbKjQ8ZhYLBA2X6mM3', '48dbzxpqllljpy4nv41h6', 'role.tenantviewer', 'ALP Tenant viewer', CURRENT_TIMESTAMP)
	ON CONFLICT(id)
	DO NOTHING;


-- Create roles
INSERT INTO public.roles(
	tenant_id, id, name, description, type)
	VALUES ('default', 'hVPDGLT4tezUSqvZKAdw7', 'role.systemadmin', 'ALP System admin', 'User')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.roles(
	tenant_id, id, name, description, type)
	VALUES ('default', 'hK4R8JXFmCPargTubEx2H', 'role.useradmin', 'ALP User admin', 'User')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.roles(
	tenant_id, id, name, description, type)
	VALUES ('default', 'ZqbayTL8mwjQs24SNpU9n', 'role.tenantviewer', 'ALP Tenant viewer', 'User')
	ON CONFLICT(id)
	DO NOTHING;


-- Create Roles-scopes
INSERT INTO public.roles_scopes(
	tenant_id, id, role_id, scope_id)
	VALUES ('default', 'W2YexvU4y63kMSNQTRq5K', 'hVPDGLT4tezUSqvZKAdw7', 'zx2438Lt9AReSVmqbNMsB')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.roles_scopes(
	tenant_id, id, role_id, scope_id)
	VALUES ('default', 'xmJhyEQc6bFsHD9C7ZwYz', 'hK4R8JXFmCPargTubEx2H', 'SPRkhWzbDLy4sUXEvgYVM')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.roles_scopes(
	tenant_id, id, role_id, scope_id)
	VALUES ('default', 'D7wVJTjzXcQgERCBM4Atq', 'ZqbayTL8mwjQs24SNpU9n', 'eC9DbKjQ8ZhYLBA2X6mM3')
	ON CONFLICT(id)
	DO NOTHING;

-- Create User-Roles
INSERT INTO public.users_roles(
	tenant_id, id, user_id, role_id)
	VALUES ('default', 'Yg5evLdhUWMaBnECzNbDQ', 'hs2gl1yng81j', 'hVPDGLT4tezUSqvZKAdw7')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.users_roles(
	tenant_id, id, user_id, role_id)
	VALUES ('default', 'Xs7Fz63J4gfakSC5ZRt8y', 'hs2gl1yng81j', 'hK4R8JXFmCPargTubEx2H')
	ON CONFLICT(id)
	DO NOTHING;

INSERT INTO public.users_roles(
	tenant_id, id, user_id, role_id)
	VALUES ('default', 'VR7tzdZ2wE5GphYmNDcTe', 'hs2gl1yng81j', 'ZqbayTL8mwjQs24SNpU9n')
	ON CONFLICT(id)
	DO NOTHING;


-- Sign-in Experiences
UPDATE public.sign_in_experiences SET
	sign_up = '{"verify": false, "password": false, "identifiers": []}',
	branding = '{"favicon": "https://localhost:41100/portal/assets/favicon.ico", "logoUrl": "https://localhost:41100/portal/assets/d2e.svg"}',
	color = '{"primaryColor": "#000080", "darkPrimaryColor": "#0000B3", "isDarkModeEnabled": false}',
	custom_css = 'a[aria-label="Powered By Logto"] { display: none; }'
WHERE tenant_id = 'default' AND id = 'default'
