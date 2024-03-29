require("dotenv").config({ debug: process.env.DEBUG });
import winston from "winston";
import { readFileSync } from "fs";

export const getProperties = (): any => {
	let properties
	if (!properties) {
	  const isProd = process.env.NODE_ENV === "production";
	  const k8sPathPrefix = "/var/alp-pg-management";
	  properties = {
		postgres_connection_config: isProd
		? JSON.parse(readFileSync(`${k8sPathPrefix}/POSTGRES_CONNECTION_CONFIG`, "utf-8"))
		: JSON.parse(process.env.POSTGRES_CONNECTION_CONFIG!),
		postgres_superuser: isProd
		? readFileSync(`${k8sPathPrefix}/POSTGRES_SUPERUSER`, "utf-8")
		: process.env.POSTGRES_SUPERUSER,
		postgres_superuser_password: isProd
		? readFileSync(`${k8sPathPrefix}/POSTGRES_SUPERUSER_PASSWORD`, "utf-8")
		: process.env.POSTGRES_SUPERUSER_PASSWORD,
		postgres_manage_config: isProd
		? JSON.parse(readFileSync(`${k8sPathPrefix}/POSTGRES_MANAGE_CONFIG`, "utf-8"))
		: JSON.parse(process.env.POSTGRES_MANAGE_CONFIG!),
		postgres_manage_users: isProd
		? JSON.parse(readFileSync(`${k8sPathPrefix}/POSTGRES_MANAGE_USERS`, "utf-8"))
		: JSON.parse(process.env.POSTGRES_MANAGE_USERS!),
	  };
	}
	return properties
} 
export const getLogger = (): any => {
	let logger
	if (!logger) {
	  logger = winston.createLogger({
		level: process.env.ALP_DB_LOGLEVEL,
		format: winston.format.json(),
		transports: [
		  new winston.transports.Console({
			format: winston.format.combine(
			  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			  winston.format.colorize(),
			  winston.format.printf((nfo) => {
				return `[${nfo.timestamp}] ${nfo.level}: ${nfo.message}`;
			  })
			),
		  }),
		],
	  });
	}
	return logger;
  }