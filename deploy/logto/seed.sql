
-- Seed Apps
INSERT INTO public.applications(
	tenant_id, id, name, secret, description, type, oidc_client_metadata, custom_client_metadata, created_at)
	VALUES ('default', 'a560o8tqw79hy2cpn8x1q', 'alp-admin', 'xk8HP4VDzqJcnXCTpdaQM6Ut2SwrG37u', 'alp-admin', 'MachineToMachine', '{  "redirectUris": [],  "postLogoutRedirectUris": [] }', '{}', CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE
	SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata;

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