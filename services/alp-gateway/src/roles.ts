interface UrlScope {
  path: string
  scopes: string[]
  httpMethods?: string[]
}

export const REQUIRED_URL_SCOPES: UrlScope[] = [
  {
    path: '^/analytics-svc/plugins/(.*)',
    scopes: ['PA.svc']
  },
  {
    path: '^/analytics-svc/api/services/population/studies/patientcount',
    scopes: ['PA.DatasetOverview.svc']
  },
  {
    path: '^/analytics-svc/api/services/(fhir|data|datastream|userStudies)/(?!schema)(.*)',
    scopes: ['PA.svc']
  },
  {
    path: '^/analytics-svc/api/services/((?!fhir)|data|datastream|userStudies|values)(.*)',
    scopes: ['PA.svc']
  },
  {
    path: '^/analytics-svc/pa/services(.*)',
    scopes: ['PA.svc']
  },
  {
    path: '^/pa-config-svc/enduser(.*)',
    scopes: ['PAConfig.svc', 'PAConfig.svc/read', 'PA.Score.svc']
  },
  {
    path: '^/pa-config-svc/services/(.*)',
    scopes: ['PAConfig.svc']
  },
  {
    path: '^/hc/hph/cdw/config/services/config.xsjs(.*)',
    scopes: ['CDWConfig.svc/read', 'CDWConfig.svc'],
    httpMethods: ['GET']
  },
  {
    path: '^/hc/hph/cdw/config/services/config.xsjs(.*)',
    scopes: ['CDWConfig.svc']
  },
  {
    path: '^/hc/hph/cdw/(.*)$',
    scopes: ['CDWConfig.svc']
  },
  {
    path: '^/hc/hph/config/services/(global|config).xsjs(.*)',
    scopes: ['CDWConfig.svc']
  },
  {
    path: '^/ps-config-svc/(.*)',
    scopes: ['PSConfig.svc']
  },
  {
    path: '^/fhir-server/(.*)',
    scopes: ['fhirServer.import'],
    httpMethods: ['POST']
  }
]
