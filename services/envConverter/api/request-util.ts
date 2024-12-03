import axios, { AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";

axios.defaults.timeout = 30000;

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error(
      `${error?.config?.method} ${error?.config?.url} ${error?.response?.status} ${error?.response?.statusText}`
    );
    throw error;
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
