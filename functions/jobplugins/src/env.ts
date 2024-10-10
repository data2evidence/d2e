import process from "node:process";

export const env = {
  SERVICE_ROUTES: process.env.SERVICE_ROUTES || "{}",
};

export const services = JSON.parse(env.SERVICE_ROUTES);
