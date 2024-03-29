export default {
  key: "mridb",
  description: "",
  analyticsSvcValues: {
    autoCommit: true,
    credentials: {
      adminPassword: "",
    },
  },
  dbSvcValues: {
    autoCommit: true,
    validateCertificate: false,
  },
  tags: [
    "alp-minerva-analytics-svc",
    "alp-minerva-db-mgmt-svc",
    "alp-sqleditor",
    "alp-dataflow-gen",
    "analytics",
    "alp-minerva-cdw-svc",
    "cdw",
  ],
};
