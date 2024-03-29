require("dotenv").config();

import express from "express";

import { appConfig } from "./utils/config";
import { canvasRoute } from "./routes/canvasRoute";
import { controllerRoute } from "./routes/controllerRoute";
import { securityRoute } from "./routes/securityRoute";
import { versioningRoute } from "./routes/versioningRoute";

const app = express();
const PORT = appConfig.NODE_PORT || 4444;

app.use(express.json());

// routes
app.use(`${appConfig.ALP_NIFI_MANAGEMENT_SVC_BASE_PATH}`, canvasRoute());
app.use(`${appConfig.ALP_NIFI_MANAGEMENT_SVC_BASE_PATH}`, controllerRoute());
app.use(`${appConfig.ALP_NIFI_MANAGEMENT_SVC_BASE_PATH}`, securityRoute());
app.use(`${appConfig.ALP_NIFI_MANAGEMENT_SVC_BASE_PATH}`, versioningRoute());

app.listen(PORT, () => {
  console.log(
    `🚀 ALP Nifi Management Service started successfully!. Server listening on port ${PORT}`
  );
});
