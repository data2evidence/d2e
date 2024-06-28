import * as logto from "./middleware/logto";
import * as pg from "pg";

async function create(
  path: string,
  headers: object,
  data: object,
  hasResponseBody = true
) {
  try {
    console.log(`Request creation ${path}`);
    console.log(`${JSON.stringify(data)}`);
    const resp = await logto.post(path, headers, data);
    console.log(`Responded with ${resp.status}`);

    if (resp.ok) {
      if (hasResponseBody) {
        let json = await resp.json();
        console.log(JSON.stringify(json));
        return json;
      }
    } else {
      console.error("Request failed");
      console.error(resp.statusText, " ", path, " ", JSON.stringify(data));
      return -1;
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchExisting(path: string, headers: object) {
  try {
    console.log(`Request existing ${path}`);
    const resp = await logto.get(path, headers);
    console.log(`Responded with ${resp.status}`);

    if (resp.ok) {
      let json = await resp.json();
      console.log(JSON.stringify(json));
      return json;
    } else {
      console.error("Request failed");
      console.error(resp.statusText, " ", path);
      return -1;
    }
  } catch (error) {
    console.error(error);
  }
}

async function queryPostgres(
  client: pg.Client,
  query: string,
  values: Array<string | number>
) {
  return await client.query(query, values);
}

async function main() {
  let apps: Array<{ name: string }> =
    JSON.parse(process.env.LOGTO__CLIENT_APPS) || [];

  let resource: { name: string } = JSON.parse(process.env.LOGTO__RESOURCE) || {
    name: "alp-default",
    indicator: "https://alp-default",
    accessTokenTtl: 3600,
  };

  let user: { username: string } = JSON.parse(process.env.LOGTO__USER);

  let scopes: Array<{ name: string }> =
    JSON.parse(process.env.LOGTO__SCOPES) || [];

  let roles: Array<{ name: string }> =
    JSON.parse(process.env.LOGTO__ROLES) || [];

  let jwt = await logto.fetchToken();
  let accessToken: string = jwt.access_token;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Create Apps
  console.log(
    "*********************************** APPLICATIONS **********************************************"
  );

  const fetchExistingApps: Array<Object> = await fetchExisting(
    "applications",
    headers
  );
  const APP_ENVS: String[] = [];
  for (const a of apps) {
    const appExists = fetchExistingApps.find(
      (existingApp: any) => existingApp.name === a.name
    );
    const {
      id: appID,
      name: appName,
      secret: appSecret,
    } = appExists || (await create("applications", headers, a));

    let ENV__CLIENT_ID, ENV__CLIENT_SECRET;

    switch (appName) {
      case "alp-app":
        ENV__CLIENT_ID = "LOGTO__ALP_APP__CLIENT_ID";
        ENV__CLIENT_SECRET = "LOGTO__ALP_APP__CLIENT_SECRET";
        break;
      case "alp-svc":
        ENV__CLIENT_ID = "LOGTO__ALP_SVC__CLIENT_ID";
        ENV__CLIENT_SECRET = "LOGTO__ALP_SVC__CLIENT_SECRET";
        break;
      case "alp-data":
        ENV__CLIENT_ID = "LOGTO__ALP_DATA__CLIENT_ID";
        ENV__CLIENT_SECRET = "LOGTO__ALP_DATA__CLIENT_SECRET";
        break;
      default:
        throw new Error(
          `Unrecoginized app name ${appName}!! Please reconfigure`
        );
    }

    console.log(
      `********************** COPY OVER ENV ASSIGNMENTS FOR ${appName} IN .env.local ***********************`
    );
    APP_ENVS.push(`${ENV__CLIENT_ID}=${appID}`,`${ENV__CLIENT_SECRET}=${appSecret}`)
    console.log(`${ENV__CLIENT_ID}=${appID}`);
    console.log(`${ENV__CLIENT_SECRET}=${appSecret}`);
    console.log(
      `******************************************************************************************\n`
    );
  }

  // Create Resource
  console.log(
    "*********************************** RESOURCE **********************************************"
  );
  const fetchExistingResources: Array<{ name: string }> = await fetchExisting(
    "resources",
    headers
  );
  const resourceExists = fetchExistingResources.find(
    (existingRes: any) => existingRes.name === resource.name
  );
  let { id: resourceId } =
    resourceExists || (await create("resources", headers, resource));

  console.log(
    "*********************************************************************************\n"
  );

  // Create Users
  console.log(
    "*********************************** USERS **********************************************"
  );
  const fetchExistingUsers: Array<{ username: string }> = await fetchExisting(
    "users",
    headers
  );
  const userExists = fetchExistingUsers.find(
    (existingUser: any) => existingUser.username === user.username
  );
  let logtoAdminUser = userExists || (await create("users", headers, user));
  console.log(
    "*********************************************************************************\n"
  );


  // Create Scopes
  console.log(
    "*********************************** SCOPES **********************************************"
  );
  const fetchExistingResourceScopes: Array<Object> = await fetchExisting(
    `resources/${resourceId}/scopes`,
    headers
  );
  let logtoScopes: Array<LogtoScope> = [];
  for (const s of scopes) {
    const resourceScopeExists = fetchExistingResourceScopes.find(
      (existingResourceScope: any) => existingResourceScope.name === s.name
    );
    let logtoScope =
      resourceScopeExists ||
      (await create(`resources/${resourceId}/scopes`, headers, s));
    logtoScopes.push(logtoScope);
  }
  console.log(
    "*********************************************************************************\n"
  );

  // Create Roles
  console.log(
    "*********************************** ROLES **********************************************"
  );
  const fetchExistingRoles: Array<Object> = await fetchExisting(
    "roles",
    headers
  );
  let logtoRoles: Array<LogtoScope> = [];
  for (const r of roles) {
    const roleExists = fetchExistingRoles.find(
      (existingRole: any) => existingRole.name === r.name
    );
    let logtoRole = roleExists || (await create("roles", headers, r));
    logtoRoles.push(logtoRole);
  }
  console.log(
    "*********************************************************************************\n"
  );

  // Create Roles-scopes
  console.log(
    "*********************************** ROLES-SCOPES **********************************************"
  );
  let roleScopes: Array<{
    roleId: string;
    scopeId: string;
    scopeName: string;
  }> = logtoRoles.map((r, indx) => ({
    roleId: r.id,
    scopeId: logtoScopes[indx]["id"],
    scopeName: logtoScopes[indx]["name"],
  }));

  for (const rs of roleScopes) {
    const fetchExistingRoleScopes: Array<Object> = await fetchExisting(
      `roles/${rs.roleId}/scopes`,
      headers
    );
    const scopeExists = fetchExistingRoleScopes.find(
      (existingScope: any) => existingScope.name === rs.scopeName
    );

    scopeExists ||
      (await create(`roles/${rs.roleId}/scopes`, headers, {
        scopeIds: [rs.scopeId],
      }));
  }
  console.log(
    "*********************************************************************************\n"
  );

  // Create User-roles
  console.log(
    "*********************************** USER-ROLES **********************************************"
  );
  let userRoles: Array<{ userId: string; roleIds: Array<string> }> = [
    {
      userId: logtoAdminUser["id"],
      roleIds: logtoRoles.map((r) => r["id"]),
    },
  ];
  for (const ur of userRoles) {
    const fetchExistingUserRoles: Array<Object> = await fetchExisting(
      `users/${ur.userId}/roles`,
      headers
    );

    const missingRoleIDs = [];

    for (const roleId of ur.roleIds) {
      const userRoleExist = fetchExistingUserRoles.find(
        (existingRole: any) => existingRole.id === roleId
      );
      if (!userRoleExist) missingRoleIDs.push(roleId);
    }

    missingRoleIDs.length && await create(
      `users/${ur.userId}/roles`,
      headers,
      {
        roleIds: missingRoleIDs,
      },
      false
    );
  }
  console.log(
    "*********************************************************************************\n"
  );

  // Create Sign-in Experiences
  let signinExperience = {
    branding: {
      favicon: "https://localhost:41100/portal/assets/favicon.ico",
      logoUrl: "https://localhost:41100/portal/assets/d2e.svg",
    },
    color: {
      primaryColor: "#000080",
      isDarkModeEnabled: false,
      darkPrimaryColor: "#0000B3",
    },
    customCss: 'a[aria-label="Powered By Logto"] { display: none; }',
    signUp: {
      password: false,
      verify: false,
    },
  };
  await logto.patch("sign-in-exp", headers, signinExperience);

  setTimeout(async () => {
    let client = new pg.Client({
      user: process.env.PG__USER,
      password: process.env.PG__PASSWORD,
      host: process.env.PG__HOST,
      port: parseInt(process.env.PG__PORT),
      database: process.env.PG__DB_NAME,
    });

    await client.connect();

    let appRows = await queryPostgres(
      client,
      "select * from public.applications where name in ($1, $2, $3)",
      ["alp-app", "alp-svc", "alp-data"]
    );
    let resourcesRows = await queryPostgres(
      client,
      "select * from public.resources where name = $1",
      ["alp-default"]
    );
    let userRows = await queryPostgres(
      client,
      "select * from public.users where username = $1 and tenant_id = $2",
      ["admin", "default"]
    );
    let scopeRows = await queryPostgres(
      client,
      "select * from public.scopes where name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let roleRows = await queryPostgres(
      client,
      "select * from public.roles where name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let roleScopeRows = await queryPostgres(
      client,
      "select * from public.roles_scopes rs join public.roles r on rs.role_id = r.id where r.name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let userRoleRows = await queryPostgres(
      client,
      "select * from public.users_roles ur join public.roles r on ur.role_id = r.id where r.name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    client.end();

    console.log(
      "*********************************** SUMMARY **********************************\n"
    );

    console.log(
      `Applications created: ${
        appRows.rowCount
      } \n Applications creation successful: ${appRows.rowCount == apps.length}`
    );
    console.log(
      `Resources created: ${
        resourcesRows.rowCount
      } \n Resources creation successful: ${resourcesRows.rowCount == 1}`
    );
    console.log(
      `Users created: ${userRows.rowCount} \n Users creation successful: ${
        userRows.rowCount == 1
      }`
    );
    console.log(
      `Scopes created: ${scopeRows.rowCount} \n Scopes creation successful: ${
        scopeRows.rowCount == scopes.length
      }`
    );
    console.log(
      `Roles created: ${roleRows.rowCount} \n Roles creation successful: ${
        roleRows.rowCount == roles.length
      }`
    );
    console.log(
      `Roles-Scopes created: ${
        roleScopeRows.rowCount
      } \n RoleScopes creation successful: ${
        roleScopeRows.rowCount == roleScopes.length
      }`
    );
    console.log(
      `Users-Roles created: ${
        userRoleRows.rowCount
      } \n UserRoles creation successful: ${
        userRoleRows.rowCount == userRoles.length * logtoRoles.length
      }`
    );

    console.log(
      `\n********************** COPY OVER ENV ASSIGNMENTS FOR LOGTO IN .env.local ***********************`
    );
    console.log(APP_ENVS.join("\n"))
    console.log(
      `****************************************************************************\n`
    );

  }, 3000);
}

async function seeding_alp_admin() {
  let logtoAdminApp = JSON.parse(process.env.LOGTO__ALP_ADMIN_APP) || {
    application: {},
    role: {},
  };
  let alpAdminApp: {
    id: string;
    name: string;
    description: string;
    secret: string;
  } = logtoAdminApp.application;
  let alpAdminRole = logtoAdminApp.role;

  let client = new pg.Client({
    user: process.env.PG__USER,
    password: process.env.PG__PASSWORD,
    host: process.env.PG__HOST,
    port: parseInt(process.env.PG__PORT),
    database: process.env.PG__DB_NAME,
  });
  await client.connect();

  let LOGTO__ADMIN_ROLE__ID = "jrmtgmb34iznwqdu5dhl1";
  let LOGTO__ADMIN_APP__ID = alpAdminApp.id;
  let LOGTO__ADMIN_APP_ROLE__ID = "34vzakbak1tp830d0s30o";
  let LOGTO__ADMIN_ROLE_SCOPE__ID = "da9va7i1g6ojghbph104e";
  let LOGTO__TENANT_ID = "default";

  console.log(
    "*********************************************************************************"
  );
  console.log(
    `Inserting ${alpAdminApp.name} application to applications table`
  );
  await queryPostgres(
    client,
    "INSERT INTO public.applications(tenant_id, id, name, secret, description, type, oidc_client_metadata) \
    VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT(id) \
    DO UPDATE SET secret = EXCLUDED.secret, oidc_client_metadata = EXCLUDED.oidc_client_metadata, custom_client_metadata = EXCLUDED.custom_client_metadata",
    [
      LOGTO__TENANT_ID,
      LOGTO__ADMIN_APP__ID,
      `${alpAdminApp.name}`,
      `${alpAdminApp.secret}`,
      `${alpAdminApp.description}`,
      "MachineToMachine",
      '{  "redirectUris": [],  "postLogoutRedirectUris": [] }',
    ]
  );

  console.log(
    "*********************************************************************************\n"
  );
  console.log(`Inserting ${alpAdminRole.name} role to roles table`);
  await queryPostgres(
    client,
    "INSERT INTO public.roles(tenant_id, id, name, description, type) \
    VALUES ($1, $2, $3, $4, $5) ON CONFLICT(id) \
    DO NOTHING;",
    [
      LOGTO__TENANT_ID,
      LOGTO__ADMIN_ROLE__ID,
      `${alpAdminRole.name}`,
      `${alpAdminRole.description}`,
      "MachineToMachine",
    ]
  );

  console.log(
    "*********************************************************************************"
  );
  console.log(
    `Adding role ${alpAdminRole.name} to application ${alpAdminApp.name}`
  );
  await queryPostgres(
    client,
    "INSERT INTO public.applications_roles(tenant_id, id, application_id, role_id) \
    VALUES ($1, $2, $3, $4) ON CONFLICT(id) \
    DO NOTHING;",
    [
      LOGTO__TENANT_ID,
      LOGTO__ADMIN_APP_ROLE__ID,
      LOGTO__ADMIN_APP__ID,
      LOGTO__ADMIN_ROLE__ID,
    ]
  );

  console.log(
    "*********************************************************************************\n"
  );
  console.log(`Adding scope "management-api-all" to role ${alpAdminRole.name}`);
  await queryPostgres(
    client,
    "INSERT INTO public.roles_scopes(tenant_id, id, role_id, scope_id) \
    VALUES ($1, $2, $3, $4) ON CONFLICT(id) \
    DO NOTHING;",
    [
      LOGTO__TENANT_ID,
      LOGTO__ADMIN_ROLE_SCOPE__ID,
      LOGTO__ADMIN_ROLE__ID,
      "management-api-all",
    ]
  );

  client.end();
}

seeding_alp_admin();
main();
