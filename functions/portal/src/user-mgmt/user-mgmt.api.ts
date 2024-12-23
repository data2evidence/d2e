import { Injectable, SCOPE } from "@danet/core";
import { services } from "../env.ts";
import { UserGroup } from "../types.d.ts";

const post = async <T = any>(
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...config,
  });
  return response.json();
};

@Injectable({ scope: SCOPE.REQUEST })
export class UserMgmtApi {
  private readonly url: string;

  constructor() {
    if (services.usermgmt) {
      this.url = services.usermgmt;
    } else {
      throw new Error("No url is set for UserMgmtApi");
    }
  }

  async getUserGroups(userId: string, jwt: string) {
    const requestConfig = this.getRequestConfig(jwt);
    const body = { userId };
    const url = `${this.url}/user-group/list`;
    return await post<UserGroup>(url, body, requestConfig);
  }

  private getRequestConfig(jwt: string): RequestInit {
    return {
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json",
      },
    };
  }
}
