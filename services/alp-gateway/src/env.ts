import { LoggingLevel } from './types'

export const env = {
  GATEWAY_PORT: Number(process.env.GATEWAY__PORT!) || 5001,
  GATEWAY_LOG_LEVEL: (process.env.GATEWAY__LOG_LEVEL as LoggingLevel) || 'info',
  GATEWAY_WO_PROTOCOL_FQDN: process.env.GATEWAY__WO_PROTOCOL__FQDN,
  GATEWAY_API_ALLOWED_DOMAINS:
    process.env.GATEWAY__API_ALLOWED_DOMAINS ||
    'http://localhost:9000 http://localhost:8080 https://localhost:5000 https://localhost:4000 https://localhost:5001 https://localhost:8080 https://localhost:4088',
  GATEWAY_IDP_AUTH_TYPE: process.env.GATEWAY__IDP_AUTH_TYPE!,
  GATEWAY_IDP_SUBJECT_PROP: process.env.GATEWAY__IDP_SUBJECT_PROP!,
  SSL_PRIVATE_KEY: process.env.TLS__INTERNAL__KEY?.replace(/\\n/g, '\n'),
  SSL_PUBLIC_CERT: process.env.TLS__INTERNAL__CRT?.replace(/\\n/g, '\n'),
  GATEWAY_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n'),
  CADDY_LOGTO_IDP_PUBLIC_FQDN: process.env.CADDY__LOGTO_IDP__PUBLIC_FQDN,
  APP_DEPLOY_MODE: process.env.APP__DEPLOY_MODE,
  IDP_ALP_SVC_CLIENT_ID: process.env.IDP__ALP_SVC_CLIENT_ID,
  IDP_ALP_DATA_CLIENT_ID: process.env.IDP__ALP_DATA_CLIENT_ID,
  IDP_RELYING_PARTY: process.env.IDP__RELYING_PARTY,
  LOGTO_CLIENT_ID: process.env.LOGTO__CLIENT_ID,
  LOGTO_CLIENT_SECRET: process.env.LOGTO__CLIENT_SECRET,
  LOGTO_ISSUER: process.env.LOGTO__ISSUER,
  LOGTO_TOKEN_URL: process.env.LOGTO__TOKEN_URL!,
  LOGTO_AUDIENCES: process.env.LOGTO__AUDIENCES,
  LOGTO_RESOURCE_API: process.env.LOGTO__RESOURCE_API,
  LOGTO_SCOPE: process.env.LOGTO__SCOPE,
  LOGTO_SVC_CLIENT_ID: process.env.LOGTO__SVC_CLIENT_ID,
  LOGTO_SVC_CLIENT_SECRET: process.env.LOGTO__SVC_CLIENT_SECRET,
  SQLEDITOR__TECHNICAL_USERNAME: process.env.SQLEDITOR__TECHNICAL_USERNAME! || 'demo',
  SQLEDITOR__TECHNICAL_USER_PASSWD: process.env.SQLEDITOR__TECHNICAL_USER_PASSWD! || 'demo',
  PLUGINS_JSON: process.env.PLUGINS__JSON || '{}',
  DB_CREDENTIALS_PUBLIC_KEYS: process.env.DB_CREDENTIALS__PUBLIC_KEYS,
  SERVICE_ROUTES: process.env.SERVICE_ROUTES || '{}',
  MEILI_MASTER_KEY: process.env.MEILI_MASTER_KEY,
  APP_LOCALE: process.env.APP_LOCALE,
  FHIR_CLIENT_ID: process.env.FHIR_CLIENT_ID,
  FHIR_CLIENT_SECRET: process.env.FHIR_CLIENT_SECRET
}

export const services = JSON.parse(env.SERVICE_ROUTES)
