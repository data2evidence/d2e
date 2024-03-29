import express from "express";
import { param, body  } from "express-validator";
import { appConfig } from "../utils/config";
import { executePythonNifiModule, validationResultCheck } from "../utils/common";

const router = express.Router();

router.get(
	"/nifi/canvas/process-group/:processGroupName/id", 
	param("processGroupName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				request.params.processGroupName === "root" ? "get_nifi_canvas_root_process_group_id" : "get_nifi_canvas_process_group_id", 
				request.params.processGroupName
			], response)
		});
	}
);

router.post(
	"/nifi/canvas/deploy-latest-versioned-flow",
	body("registryClientName").trim().notEmpty(),
	body("bucketName").trim().notEmpty(),
	body("flowName").trim().notEmpty(),
	body("processGroupNameToDeploy").trim().notEmpty(),
	body("canvasXCoordinates").trim().isNumeric({no_symbols: true}).notEmpty(),
	body("canvasYCoordinates").trim().isNumeric({no_symbols: true}).notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"deploy_latest_version_flow_to_nifi_canvas", 
				request.body.registryClientName, 
				request.body.bucketName, 
				request.body.flowName, 
				request.body.processGroupNameToDeploy, 
				request.body.canvasXCoordinates, 
				request.body.canvasYCoordinates
			], response);
		});
	}
);

router.put(
	"/nifi/canvas/update-flow-version", 
	body("processGroupName").trim().notEmpty(),
	body("targetVersion").trim().isNumeric({no_symbols: true}).notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"update_flow_version_in_nifi_canvas", 
				request.body.processGroupName, 
				request.body.targetVersion
			], response);
		});
	}
);

router.delete(
	"/nifi/canvas/process-group",
	body("processGroupName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"remove_process_group_from_nifi_canvas", 
				request.body.processGroupName
			], response);
		});
	}
);

export const canvasRoute = () => router