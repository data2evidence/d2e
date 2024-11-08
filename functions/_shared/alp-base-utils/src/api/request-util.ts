import axios, { AxiosRequestConfig } from "axios";

axios.defaults.timeout = 10000;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error;
  },
);
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<T>(url, data, config);
};
