import * as logto from "./middleware/logto";
import * as pg from "pg";
import {
  writeEnvFile,
  removeEnvLine,
  copyBackupFile,
  restoreFile,
  cleanupFile,
} from "./utils/manipulateFile";
import * as nodeutil from "node:util";
const sleep = nodeutil.promisify(setTimeout);

async function create(
  path: string,
  headers: object,
  data: object,
  hasResponseBody = true
) {
  try {
    console.info(`Request creation ${path}`);
    console.info(`${JSON.stringify(data)}`);
    const resp = await logto.post(path, headers, data);
    console.info(`Responded with ${resp.status}`);

    if (resp.ok) {
      if (hasResponseBody) {
        let json = await resp.json();
        console.info(JSON.stringify(json));
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

async function update(
  path: string,
  headers: object,
  data: object,
  hasResponseBody = true
) {
  try {
    console.info(`Request update ${path}`);
    console.info(JSON.stringify(data));
    const resp = await logto.patch(path, headers, data);
    console.info(`Responded with ${resp.status}`);

    if (resp.ok) {
      if (hasResponseBody) {
        let json = await resp.json();
        console.info(JSON.stringify(json));
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

async function fetchExisting(path: string, headers: object, showLog = true) {
  try {
    showLog && console.info(`Request existing ${path}`);
    const resp = await logto.get(path, headers);
    showLog && console.info(`Responded with ${resp.status}`);

    if (resp.ok) {
      let json = await resp.json();
      showLog && console.info(JSON.stringify(json));
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

  let user: { username: string; initialPassword: string } = JSON.parse(
    process.env.LOGTO__USER
  );

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
  console.info(
    "*********************************** APPLICATIONS **********************************************"
  );

  const fetchExistingApps: Array<Object> = await fetchExisting(
    "applications",
    headers
  );
  const APP_ENVS: string[] = [];
  for (const a of apps) {
    const appExists = fetchExistingApps.find(
      (existingApp: any) => existingApp.name === a.name
    );
    const {
      id: appID,
      name: appName,
      secret: appSecret,
    } = appExists || (await create("applications", headers, a));

    if (appExists) {
      await update(`applications/${appID}`, headers, a);
    }

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

    console.info(
      `********************** COPY OVER ENV ASSIGNMENTS FOR ${appName} IN .env.local ***********************`
    );
    APP_ENVS.push(
      `${ENV__CLIENT_ID}=${appID}`,
      `${ENV__CLIENT_SECRET}=${appSecret}`
    );
    console.info(`${ENV__CLIENT_ID}=${appID}`);
    console.info(`${ENV__CLIENT_SECRET}=${appSecret}`);
    console.info(
      `******************************************************************************************\n`
    );
  }

  // Create Resource
  console.info(
    "*********************************** RESOURCE **********************************************"
  );
  const fetchExistingResources: Array<{ name: string }> = await fetchExisting(
    "resources",
    headers
  );
  const resourceExists = fetchExistingResources.find(
    (existingRes: any) => existingRes.name === resource.name
  );
  let { id: resourceId, isDefault } =
    resourceExists || (await create("resources", headers, resource));

  if (resourceExists) {
    const updated = await update(`resources/${resourceId}`, headers, resource);
    isDefault = updated.isDefault;
  }

  if (!isDefault) {
    // Set the resource as the default
    await logto.patch(`resources/${resourceId}/is-default`, headers, {
      isDefault: true,
    });
  }

  console.info(
    "*********************************************************************************\n"
  );

  // Create Users
  console.info(
    "*********************************** USERS **********************************************"
  );
  const fetchExistingUsers: Array<{ username: string }> = await fetchExisting(
    "users",
    headers
  );
  const userExists = fetchExistingUsers.find(
    (existingUser: any) =>
      existingUser.username === user.username &&
      existingUser.tenant_id === "default"
  );
  let logtoAdminUser = userExists || (await create("users", headers, user));

  if (userExists) {
    await update(`users/${logtoAdminUser.id}`, headers, user);
  }

  if (!logtoAdminUser["lastSignInAt"])
    await logto.patch(`users/${logtoAdminUser.id}/password`, headers, {
      password: user["initialPassword"],
    });

  console.info(
    "*********************************************************************************\n"
  );

  // Create Scopes
  console.info(
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

    if (resourceScopeExists) {
      await update(
        `resources/${resourceId}/scopes/${logtoScope.id}`,
        headers,
        s
      );
    }

    logtoScopes.push(logtoScope);
  }
  console.info(
    "*********************************************************************************\n"
  );

  // Create Roles
  console.info(
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

    if (roleExists) {
      await update(`roles/${logtoRole.id}`, headers, r);
    }

    logtoRoles.push(logtoRole);
  }
  console.info(
    "*********************************************************************************\n"
  );

  // Create Roles-scopes
  console.info(
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
  console.info(
    "*********************************************************************************\n"
  );

  let userRoles: Array<{ userId: string; roleIds: Array<string> }> = [];
  if (logtoAdminUser && logtoAdminUser["id"]) {
    // Create User-roles
    console.info(
      "*********************************** USER-ROLES **********************************************"
    );
    userRoles = [
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

      missingRoleIDs.length &&
        (await create(
          `users/${ur.userId}/roles`,
          headers,
          {
            roleIds: missingRoleIDs,
          },
          false
        ));
    }
    console.info(
      "*********************************************************************************\n"
    );
  }

  // Create Sign-in Experiences
  let signinExperience = {
    branding: {
      favicon: `https://${process.env.PUBLIC__FQDN}/portal/assets/favicon.ico`,
      logoUrl: `https://${process.env.PUBLIC__FQDN}/portal/assets/d2e.svg`,
    },
    color: {
      primaryColor: "#000080",
      isDarkModeEnabled: false,
      darkPrimaryColor: "#0000B3",
    },
    customCss: 'a[aria-label="Powered By Logto"] { display: none; }',
    signInMode: "SignIn", //Disable user registration At Login screen
    signUp: {
      password: false,
      verify: false,
    },
  };
  await logto.patch("sign-in-exp", headers, signinExperience);

  console.info(
    "*********************************** SUMMARY **********************************\n"
  );

  const createdApps: Array<Object> = (
    await fetchExisting("applications", headers, false)
  ).filter((a: any) => apps.map((x) => x.name).includes(a.name));

  console.info(
    `Applications created: ${
      createdApps.length
    } \n Applications creation successful: ${createdApps.length == apps.length}`
  );

  const createdResources: Array<Object> = (
    await fetchExisting("resources", headers, false)
  ).filter((a: any) => resource.name === a.name);

  console.info(
    `Resources created: ${
      createdResources.length
    } \n Resources creation successful: ${createdResources.length == 1}`
  );

  const createdUsers: Array<Object> = (
    await fetchExisting("users", headers, false)
  ).filter((a: any) => user.username === a.username);

  console.info(
    `Users created: ${createdUsers.length} \n Users creation successful: ${
      createdUsers.length == 1
    }`
  );

  const createdScopes: Array<Object> = (
    await fetchExisting(`resources/${resourceId}/scopes`, headers, false)
  ).filter((s: any) => scopes.map((x) => x.name).includes(s.name));

  console.info(
    `Scopes created: ${createdScopes.length} \n Scopes creation successful: ${
      createdScopes.length == scopes.length
    }`
  );

  const createdRoles: Array<Object> = (
    await fetchExisting("roles", headers, false)
  ).filter((r: any) => roles.map((x) => x.name).includes(r.name));

  console.info(
    `Roles created: ${createdRoles.length} \n Roles creation successful: ${
      createdRoles.length == roles.length
    }`
  );

  const createdRoleScopes: Array<Object> = (
    await Promise.all(
      roleScopes.map((rs) =>
        fetchExisting(`roles/${rs.roleId}/scopes`, headers, false)
      )
    )
  ).filter((rs: any) => roleScopes.map((x) => x.scopeName === rs.name));

  console.info(
    `Roles-Scopes created: ${
      createdRoleScopes.length
    } \n Role-Scopes creation successful: ${
      createdRoleScopes.length == roleScopes.length
    }`
  );

  const createdUserRoles: Array<Object> = (
    await Promise.all(
      userRoles.map((ur) =>
        fetchExisting(`users/${ur.userId}/roles`, headers, false)
      )
    )
  )
    .filter((rs: any) => userRoles.map((x) => x.roleIds === rs.id))
    .flat();

  console.info(
    `Users-Roles created: ${
      createdUserRoles.length
    } \n User-Roles creation successful: ${
      createdUserRoles.length == userRoles.map((x) => x.roleIds).flat().length
    }`
  );

  // Inject Logto envs to .env.$ENV_TYPE
  await (async () => {
    const orignalEnvFileWithPath = `/run/envs/.env.${process.env.ENV_TYPE}`;
    const backupFileWithPath = orignalEnvFileWithPath + ".tmp";
    await copyBackupFile(orignalEnvFileWithPath, backupFileWithPath);
    console.debug(`backup file path ${backupFileWithPath}`);
    // Remove existing env & Write to env file
    APP_ENVS.forEach(async (env) => {
      const key = env.split("=")[0];
      console.debug(`Removing key ${key}`);
      await removeEnvLine(key, backupFileWithPath);
    });
    await sleep(3000);
    await writeEnvFile("\n" + APP_ENVS.join("\n"), backupFileWithPath);
    await restoreFile(backupFileWithPath, orignalEnvFileWithPath);
    await cleanupFile(backupFileWithPath);
  })();

  console.info(
    `\n********************** LOGTO ENV ASSIGNMENTS Generated IN .env.${process.env.ENV_TYPE} *************************`
  );
  console.info(APP_ENVS.join("\n"));
  console.info(
    `**********************************************************************************************`
  );
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

  console.info(
    "*********************************************************************************"
  );
  console.info(
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

  console.info(
    "*********************************************************************************\n"
  );
  console.info(`Inserting ${alpAdminRole.name} role to roles table`);
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

  console.info(
    "*********************************************************************************"
  );
  console.info(
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

  console.info(
    "*********************************************************************************\n"
  );
  console.info(`Adding scope "management-api-all" to role ${alpAdminRole.name}`);
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
