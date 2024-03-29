import { AxiosRequestConfig } from "axios";
import { getProperties } from "../utils/config";
import { post, get } from "./request-util";

export class UserMgmtAPI {
  private readonly baseURL: string;
  private readonly properties = getProperties();

  constructor() {
    if (this.properties.user_mgmt_base_url) {
      this.baseURL = this.properties.user_mgmt_base_url;
    } else {
      throw new Error("No url is set for UserMgmtAPI");
    }
  }

  async getUserGroups(token: string, userId: string) {
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: token,
      },
    };
    const url = `${this.baseURL}user-group/list`;
    const result = await post(url, { userId }, options);
    return result.data;
  }

  async getUser(token: string, userId: string) {
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: token,
      },
    };
    const url = `${this.baseURL}user/${userId}`;
    const result = await get(url, options);
    return result.data;
  }
}
