import { Constants } from "./Constants";
import { isClientCredToken } from "./utils";
import { IAppTokenPayload, IUser } from "./types";

export const SAMPLE_USER_JWT: IAppTokenPayload = {
  iss: "https://dummy.com/02a644b8-0e9c-4183-8cfb-5326425c4460/v2.0/",
  exp: 1603893181,
  nbf: 1603889581,
  aud: "9f8915ae-9091-4654-a5b7-81b45ecf31ae",
  sub: "538a829a-fa0b-475b-83ac-1bce86fc4f8e",
  email: "alice@wonderland",
  name: "alice",
  given_name: "alice",
  family_name: "wonderland",
  extension_termsOfUseConsentVersion: "V4",
  userMgmtGroups: {
    groups: [
      "Grafana admin Users",
      "Grafana editor users",
      "MRI_SUPER_USER",
      "ROLE=ALP_ADMIN",
      "TID=ef003beb-7f58-44b8-9744-6d8250a015d5;ROLE=TENANT_ADMIN",
      "TID=ef003beb-7f58-44b8-9744-6d8250a015d5;SID=9b85234d-efd5-4734-9686-f988d470ffc9;ROLE=RESEARCHER",
    ],
    alp_tenant_id: ["ef003beb-7f58-44b8-9744-6d8250a015d5"],
    alp_role_study_researcher: ["9b85234d-efd5-4734-9686-f988d470ffc9"],
    alp_role_tenant_admin: ["ef003beb-7f58-44b8-9744-6d8250a015d5"],
    alp_role_admin: true,
    alp_role_tenant_viewer: [],
    alp_role_study_admin: [],
    alp_role_study_mgr: [],
  },
  tid: "ef003beb-7f58-44b8-9744-6d8250a015d5",
  scp: "pyqe.client",
  azp: "9f8915ae-9091-4654-a5b7-81b45ecf31ae",
  ver: "1.0",
  iat: 1603889581,
};

const buildUserFromToken = (token: IAppTokenPayload): IUser => {
  const { name, sub, email, userMgmtGroups, groups: adGroups } = token;
  const {
    alp_tenant_id,
    alp_role_study_researcher,
    alp_role_study_mgr,
    alp_role_study_admin,
    alp_role_tenant_admin,
    alp_role_tenant_viewer,
    alp_role_admin,
    alp_role_owner,
    groups,
  } = userMgmtGroups;

  if (typeof alp_tenant_id === "undefined" || alp_tenant_id.length === 0) {
    console.error(
      `SECURITY INCIDENT: User does not belong to a tenant ${JSON.stringify(
        token,
      )}`,
    );
    throw new Error("User does not belong to a tenant");
  }

  const roles = [];
  const mriRoles = [];
  let mriScopes = [];
  const { ALP_ROLES, MRI_ROLE_ASSIGNMENTS } = Constants;

  if (typeof alp_role_admin !== "undefined" && alp_role_admin) {
    roles.push(ALP_ROLES.ALP_ADMIN_ROLE as string);
    mriRoles.push(ALP_ROLES.ALP_ADMIN_ROLE);
    mriScopes.push(...MRI_ROLE_ASSIGNMENTS.ALP_ADMIN_ROLE);
  }

  if (typeof alp_role_owner !== "undefined" && alp_role_owner) {
    mriRoles.push(ALP_ROLES.ALP_OWNER_ROLE);
    mriScopes.push(...MRI_ROLE_ASSIGNMENTS.ALP_OWNER_ROLE);
  }

  if (alp_role_tenant_admin && alp_role_tenant_admin.length > 0) {
    roles.push(ALP_ROLES.TENANT_ADMIN_ROLE);
  }

  if (alp_role_tenant_viewer && alp_role_tenant_viewer.length > 0) {
    roles.push(ALP_ROLES.TENANT_VIEWER_ROLE);
    mriScopes.push(MRI_ROLE_ASSIGNMENTS.STUDY_VIEWER_ROLE);
  }

  if (alp_role_study_admin && alp_role_study_admin.length > 0) {
    roles.push(ALP_ROLES.STUDY_ADMIN_ROLE);
  }

  if (alp_role_study_mgr && alp_role_study_mgr.length > 0) {
    roles.push(ALP_ROLES.STUDY_MANAGER_ROLE);
  }

  if (alp_role_study_researcher && alp_role_study_researcher.length > 0) {
    roles.push(ALP_ROLES.STUDY_RESEARCHER_ROLE);
    mriRoles.push(ALP_ROLES.STUDY_RESEARCHER_ROLE);
    mriScopes.push(...MRI_ROLE_ASSIGNMENTS.STUDY_RESEARCHER_ROLE);
  }

  mriScopes = (typeof groups === "string" ? [] : groups).reduce(
    (accumulator, group) => {
      if (MRI_ROLE_ASSIGNMENTS[group]) {
        mriRoles.push(group);
        accumulator = accumulator.concat(MRI_ROLE_ASSIGNMENTS[group]);
      }

      return accumulator;
    },
    mriScopes,
  );

  const user: IUser = {
    userId: sub,
    name,
    email,
    tenantId: alp_tenant_id,
    mriRoles,
    mriScopes,
    alpRoleMap: {
      ALP_ADMIN_ROLE: alp_role_admin,
      ALP_OWNER_ROLE: alp_role_owner,
      TENANT_ADMIN_ROLE: alp_role_tenant_admin,
      TENANT_VIEWER_ROLE: alp_role_tenant_viewer,
      STUDY_ADMIN_ROLE: alp_role_study_admin,
      STUDY_MANAGER_ROLE: alp_role_study_mgr,
      STUDY_RESEARCHER_ROLE: alp_role_study_researcher,
    },
    roles,
    groups: typeof groups === "string" ? [groups] : groups,
  };

  return user;
};

export class User {
  private isAlice: boolean = false;
  private isClientCredReqUser: boolean = false;
  private user: IUser;

  constructor(
    private token: IAppTokenPayload | string,
    private userLang: string = "en",
  ) {
    if (typeof token === "string") {
      this.isAlice = true;
      return;
    }

    if (isClientCredToken(token)) {
      this.isClientCredReqUser = true;
      return;
    }

    const { sub, userMgmtGroups } = token;

    if (!sub) {
      throw new Error("token has no sub");
    } else if (!userMgmtGroups) {
      throw new Error("token has no userMgmtGroups");
    }

    this.userLang = userLang.split("-")[0];

    this.user = buildUserFromToken(token);
  }

  get userObject(): IUser {
    return this.user;
  }

  public getUser(): string {
    if (this.isAlice) {
      return "ALICE";
    }

    if (this.isClientCredReqUser) {
      return "CLIENT_CRED_REQ_USER";
    }

    return this.user.userId;
  }

  get lang(): string {
    return this.userLang;
  }

  get isClientCredUser(): boolean {
    if (this.isClientCredReqUser) {
      return true;
    }
    return false;
  }
}
