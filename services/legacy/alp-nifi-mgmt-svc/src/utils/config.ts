import { AppConfig } from "./type";

const getBoolean = (value: string) => {
  return value.toUpperCase() === "TRUE";
};

const getNumber = (value: string) => {
  if (Number(value)) {
    return Number(value);
  }
  throw new Error("Invalid value to convert from string to number.");
};

export const appConfig: AppConfig = {
  NODE_PORT: getNumber(process.env.NIFI_MGMT__PORT!),
  SKIP_AUTH:
    process.env.NODE_ENV === "local"
      ? getBoolean(process.env.SKIP_AUTH!)
      : false,
  PYTHON_NIFI_MODULE: "./py_nifi_modules/app.py",
  ALP_NIFI_MANAGEMENT_SVC_BASE_PATH: "/alp-nifi-api",
  USER_MGMT_BASE_URL: process.env.USER_MGMT__BASE_URL!,
};
