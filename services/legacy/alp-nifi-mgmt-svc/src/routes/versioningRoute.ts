import express from "express";
import { param } from "express-validator";
import { appConfig } from "../utils/config";
import { executePythonNifiModule, validationResultCheck } from "../utils/common";

const router = express.Router();

router.get(
	"/nifi-registry/versioning/bucket/:bucketName", 
	param("bucketName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_nifi_registry_bucket",
				request.params.bucketName
			], response)
		});
	}
);

router.get(
	"/nifi-registry/versioning/bucket/:bucketName/versioned-flows", 
	param("bucketName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_nifi_registry_flow_list_in_bucket", 
				request.params.bucketName
			], response)
		});
	}
);

router.get(
	"/nifi-registry/versioning/bucket/:bucketName/versioned-flow/:flowName", 
	param("bucketName").trim().notEmpty(),
	param("flowName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_nifi_registry_flow_in_bucket", 
				request.params.bucketName,
				request.params.flowName
			], response)
		});
	}
);

export const versioningRoute = () => router