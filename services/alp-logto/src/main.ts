import * as logto from "./middleware/logto";
import * as pg from "pg";

let apps: Array<Object> = [
  {
    name: "alp-svc",
    description: "alp-svc",
    type: "MachineToMachine",
  },
  {
    name: "alp-data",
    description: "alp-data",
    type: "MachineToMachine",
  },
  {
    name: "alp-app",
    description: "alp-app",
    type: "Traditional",
    oidcClientMetadata: {
      redirectUris: [
        "https://localhost:41100/portal/login-callback",
        "https://localhost:4000/portal/login-callback",
        "https://localhost:8081",
      ],
      postLogoutRedirectUris: [
        "https://localhost:41100/portal",
        "https://localhost:4000/portal",
        "https://localhost:8081",
      ],
    },
    customClientMetadata: {
      corsAllowedOrigins: [],
      refreshTokenTtlInDays: 14,
      alwaysIssueRefreshToken: true,
      rotateRefreshToken: true,
    },
  },
];

let resource: Object = {
  name: "alp-default",
  indicator: "https://alp-default",
  accessTokenTtl: 3600,
};

let user: Object = {
  username: "admin",
  password:
    "$argon2i$v=19$m=4096,t=256,p=1$gFXKgnc0tFywI7DcRVN+Tg$c0TeMUiDq6PMCLyJmR/V/sb1MV8MpMBeRy24+ZsZgeY",
  passwordAlgorithm: "Argon2i",
};

let scopes: Array<Object> = [
  { name: "role.systemadmin", description: "ALP System admin" },
  { name: "role.useradmin", description: "ALP User admin" },
  { name: "role.tenantviewer", description: "ALP Tenant viewer" },
];

let roles: Array<Object> = [
  {
    name: "role.systemadmin",
    description: "ALP System admin",
    type: "User",
  },
  {
    name: "role.useradmin",
    description: "ALP User admin",
    type: "User",
  },
  {
    name: "role.tenantviewer",
    description: "ALP Tenant viewer",
    type: "User",
  },
];

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

async function getPgRows(
  client: pg.Client,
  query: string,
  values: Array<string | number>
) {
  return await client.query(query, values);
}

async function main() {
  let jwt = await logto.fetchToken();
  let accessToken: string = jwt.access_token;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  apps.forEach(async (a) => {
    let response = await callback("applications", headers, a);
  });

  let { id: resourceId } = await callback("resources", headers, resource);

  let logtoAdminUser = await callback("users", headers, user);

  let logtoScopes: Array<LogtoScope> = [];
  scopes.forEach(async (s) => {});
  for (const s of scopes) {
    let logtoScope = await callback(
      `resources/${resourceId}/scopes`,
      headers,
      s
    );
    logtoScopes.push(logtoScope);
  }

  let logtoRoles: Array<LogtoScope> = [];
  for (const r of roles) {
    let logtoRole = await callback("roles", headers, r);
    logtoRoles.push(logtoRole);
  }

  let roleScopes: Array<{ roleId: string; scopeId: string }> = logtoRoles.map(
    (r, indx) => ({ roleId: r.id, scopeId: logtoScopes[indx]["id"] })
  );
  for (const rs of roleScopes) {
    let response = await callback(`roles/${rs.roleId}/scopes`, headers, {
      scopeIds: [rs.scopeId],
    });
  }

  let userRoles: Array<{ userId: string; roleIds: Array<string> }> = [
    {
      userId: logtoAdminUser["id"],
      roleIds: logtoRoles.map((r) => r["id"]),
    },
  ];
  for (const ur of userRoles) {
    let response = await callback(`users/${ur.userId}/roles`, headers, {
      roleIds: ur.roleIds,
    });
  }

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
  let response = await logto.patch("sign-in-exp", headers, signinExperience);

  setTimeout(async () => {
    let client = new pg.Client({
      user: process.env.PG__USER,
      password: process.env.PG__PASSWORD,
      host: process.env.PG__HOST,
      port: parseInt(process.env.PG__PORT),
      database: process.env.PG__DB_NAME,
    });

    await client.connect();

    let appRows = await getPgRows(
      client,
      "select * from public.applications where name in ($1, $2, $3)",
      ["alp-app", "alp-svc", "alp-data"]
    );
    let resourcesRows = await getPgRows(
      client,
      "select * from public.resources where name = $1",
      ["alp-default"]
    );
    let userRows = await getPgRows(
      client,
      "select * from public.users where username = $1 and tenant_id = $2",
      ["admin", "default"]
    );
    let scopeRows = await getPgRows(
      client,
      "select * from public.scopes where name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let roleRows = await getPgRows(
      client,
      "select * from public.roles where name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let roleScopeRows = await getPgRows(
      client,
      "select * from public.roles_scopes rs join public.roles r on rs.role_id = r.id where r.name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    let userRoleRows = await getPgRows(
      client,
      "select * from public.users_roles ur join public.roles r on ur.role_id = r.id where r.name in ($1, $2, $3)",
      ["role.systemadmin", "role.useradmin", "role.tenantviewer"]
    );

    client.end();

    // return resourcesRows.rowCount == 1 && appRows.rowCount == 3 && userRows.rowCount == 1;
    console.log(`Applications created: ${appRows.rowCount}`);
    console.log(`Resources created: ${resourcesRows.rowCount}`);
    console.log(`Users created: ${userRows.rowCount}`);
    console.log(`Scopes created: ${scopeRows.rowCount}`);
    console.log(`Roles created: ${roleRows.rowCount}`);
    console.log(`Roles-Scopes created: ${roleScopeRows.rowCount}`);
    console.log(`Users-Roles created: ${userRoleRows.rowCount}`);
  }, 3000);
}

main();
