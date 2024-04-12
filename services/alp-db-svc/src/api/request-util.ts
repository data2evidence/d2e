import axios, { AxiosRequestConfig } from "axios";
import { getLogger, getProperties } from "../utils/config";
import https from "https";

const logger = getLogger();

axios.defaults.timeout = 10000;

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "script"
) {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  axios.defaults.httpsAgent = httpsAgent;
  logger.info("rejectUnauthorized is disabled");
} else {
  const httpsAgent = new https.Agent({
    ca: getProperties()["ssl_ca_cert"],
  });
  axios.defaults.httpsAgent = httpsAgent;
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    logger.error(`${error?.config?.method} ${error?.config?.url} ${error}`);
    return error;
  }
);

export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return axios.get<T>(url, config);
};

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  return axios.post<T>(url, data, config);
};

export const del = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return axios.delete<T>(url, config);
};
