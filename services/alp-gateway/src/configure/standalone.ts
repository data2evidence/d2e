import { env } from '../env'
import { Express, Request, Response } from 'express'

export const configureStandalone = (app: Express) => {
  if (env.APP_DEPLOY_MODE !== 'standalone') {
    return
  }

  const GATEWAY_WO_PROTOCOL_FQDN = env.GATEWAY_WO_PROTOCOL_FQDN!
  const CLIENT_ID = env.LOGTO_CLIENT_ID
  const IDP_BASE_URL = `https://${env.CADDY_LOGTO_IDP_PUBLIC_FQDN}:3001`
  const ISSUER_URL = env.LOGTO_ISSUER
  const AUTHORIZATION_URL = `${IDP_BASE_URL}/oidc/auth`
  const END_SESSION_URL = `${IDP_BASE_URL}/oidc/session/end?client_id=${CLIENT_ID}&redirect={window.location.origin}/portal`
  const REVOKE_URL = `${IDP_BASE_URL}/oidc/token/revocation`
  const SCOPE = env.LOGTO_SCOPE

  app.get('/portal/env.js', (req: Request, res: Response) => {
    const clientEnv = {
      PUBLIC_URL: '/portal',
      REACT_APP_LOCALE: env.APP_LOCALE,
      GIT_COMMIT: process.env.GIT_COMMIT,
      REACT_APP_IDP_RELYING_PARTY: env.IDP_RELYING_PARTY,
      REACT_APP_DN_BASE_URL: `https://${GATEWAY_WO_PROTOCOL_FQDN}/`,
      REACT_APP_CURRENT_SYSTEM: 'Local',
      REACT_APP_IDP_SUBJECT_PROP: 'sub',
      REACT_APP_IDP_NAME_PROP: 'username',
      REACT_APP_IDP_OIDC_CONFIG: `{ "client_id": "${CLIENT_ID}", "redirect_uri": "{window.location.origin}/portal/login-callback", "authority": "${IDP_BASE_URL}", "authority_configuration": { "issuer": "${ISSUER_URL}", "authorization_endpoint": "${AUTHORIZATION_URL}", "token_endpoint": "https://${GATEWAY_WO_PROTOCOL_FQDN}/oauth/token", "end_session_endpoint": "${END_SESSION_URL}", "revocation_endpoint": "${REVOKE_URL}" }, "scope": "${SCOPE}" }`,
      REACT_APP_DB_CREDENTIALS_PUBLIC_KEYS: certEscapeNewLine(env.DB_CREDENTIALS_PUBLIC_KEYS || "").replace('}\\n', '}'),
      REACT_APP_PLUGINS: env.PLUGINS_JSON,
      REACT_APP_MRI_CONFIG_NAME: 'OMOP_GDM_PA_CONF' // Currently supporting static configs
    }

    res.contentType('application/javascript')
    res.send(`window.ENV_DATA = ${JSON.stringify(clientEnv)}`)
  })
}

const certEscapeNewLine = (str: string) => {
  return str.replace(/-----BEGIN PUBLIC KEY-----(.*?)-----END PUBLIC KEY-----/gs, (match) => {
    return match.replace(/\n/g, "\\n"); 
  });
}
