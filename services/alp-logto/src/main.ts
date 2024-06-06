import * as logto from "./middleware/logto";
import * as pg from "pg";

async function callback(path: string, headers: object, data: object) {
  try {
    console.log(`Requesting ${path}`);
    console.log(`${JSON.stringify(data)}`);
    const resp = await logto.post(path, headers, data);
    console.log(`Responded with ${resp.status}`);
    if (resp.ok) {
      let json = await resp.json();
      console.log(JSON.stringify(json));
      return json;
    } else {
      console.log("Request failed");
      console.log(resp.statusText, " ", path, " ", JSON.stringify(data));
      return -1;
    }
  } catch (error) {
    console.log(error);
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
  let apps: Array<Object> = JSON.parse(process.env.LOGTO__CLIENT_APPS) || [];

  let resource: Object = JSON.parse(process.env.LOGTO__RESOURCE) || {
    name: "alp-default",
    indicator: "https://alp-default",
    accessTokenTtl: 3600,
  };

  let user: Object = JSON.parse(process.env.LOGTO__USER) || {
    username: "admin",
    password:
      "$argon2i$v=19$m=4096,t=256,p=1$gFXKgnc0tFywI7DcRVN+Tg$c0TeMUiDq6PMCLyJmR/V/sb1MV8MpMBeRy24+ZsZgeY",
    passwordAlgorithm: "Argon2i",
  };

  let scopes: Array<Object> = JSON.parse(process.env.LOGTO__SCOPES) || [];

  let roles: Array<Object> = JSON.parse(process.env.LOGTO__ROLES) || [];

  let jwt = await logto.fetchToken();
  let accessToken: string = jwt.access_token;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  console.log(
    "*********************************************************************************"
  );
  for (const a of apps) {
    await callback("applications", headers, a);
  }

  console.log(
    "*********************************************************************************"
  );
  let { id: resourceId } = await callback("resources", headers, resource);

  console.log(
    "*********************************************************************************"
  );
  let logtoAdminUser = await callback("users", headers, user);

  console.log(
    "*********************************************************************************"
  );
  let logtoScopes: Array<LogtoScope> = [];
  for (const s of scopes) {
    let logtoScope = await callback(
      `resources/${resourceId}/scopes`,
      headers,
      s
    );
    logtoScopes.push(logtoScope);
  }

  console.log(
    "*********************************************************************************"
  );
  let logtoRoles: Array<LogtoScope> = [];
  for (const r of roles) {
    let logtoRole = await callback("roles", headers, r);
    logtoRoles.push(logtoRole);
  }

  console.log(
    "*********************************************************************************"
  );
  let roleScopes: Array<{ roleId: string; scopeId: string }> = logtoRoles.map(
    (r, indx) => ({ roleId: r.id, scopeId: logtoScopes[indx]["id"] })
  );
  for (const rs of roleScopes) {
    await callback(`roles/${rs.roleId}/scopes`, headers, {
      scopeIds: [rs.scopeId],
    });
  }

  console.log(
    "*********************************************************************************"
  );
  let userRoles: Array<{ userId: string; roleIds: Array<string> }> = [
    {
      userId: logtoAdminUser["id"],
      roleIds: logtoRoles.map((r) => r["id"]),
    },
  ];
  for (const ur of userRoles) {
    await callback(`users/${ur.userId}/roles`, headers, {
      roleIds: ur.roleIds,
    });
  }

  console.log(
    "*********************************************************************************"
  );
  let signinExperience = {
    branding: {
      favicon: "https://localhost:41100/portal/assets/favicon.ico",
      logoUrl: "https://localhost:41100/portal/assets/d2e.png",
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
        userRoleRows.rowCount == userRoles.length
      }`
    );
  }, 3000);
}

async function seeding_alp_admin() {
  let logtoAdminApp = JSON.parse(process.env.LOGTO__ALP_ADMIN_APP) || {
    application: {},
    role: {},
  };
  let alpAdminApp: {
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

  let LOGTO__ADMIN_ROLE__ID = "api-access";
  let LOGTO__ADMIN_APP__ID = "alp-admin";
  let LOGTO__ADMIN_APP_ROLE__ID = "alp-admin";
  let LOGTO__ADMIN_ROLE_SCOPE__ID = "alp-admin";
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
    "*********************************************************************************"
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
    "*********************************************************************************"
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
