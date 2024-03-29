import express from "express";
import { param, body } from "express-validator";
import { appConfig } from "../utils/config";
import { executePythonNifiModule, validationResultCheck } from "../utils/common";

const router = express.Router();

router.get(
	"/nifi/controller/registry-clients",
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_nifi_registry_client_in_nifi"
			], response)
		});
	}
);

router.get(
	"/nifi/controller/registry-client/:registryClientName",
	param("registryClientName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_nifi_registry_client_in_nifi",
                request.params.registryClientName
			], response)
		});
	}
);

router.post(
	"/nifi/controller/registry-client",
	body("name").trim().notEmpty(),
	body("uri").trim().notEmpty(),
	body("description").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_nifi_registry_client_in_nifi",
                request.body.name,
                request.body.uri,
                request.body.description
			], response)
		});
	}
);

router.put(
	"/nifi/controller/registry-client/update-name",
	body("registryClientName").trim().notEmpty(),
	body("name").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_nifi_registry_client_in_nifi",
                request.body.registryClientName,
                request.body.name
			], response)
		});
	}
);

router.put(
	"/nifi/controller/registry-client/update-name",
	body("registryClientName").trim().notEmpty(),
	body("uri").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_nifi_registry_client_in_nifi",
                request.body.registryClientName,
                request.body.uri
			], response)
		});
	}
);

router.put(
	"/nifi/controller/registry-client/update-name",
	body("registryClientName").trim().notEmpty(),
	body("description").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_nifi_registry_client_in_nifi",
                request.body.registryClientName,
                request.body.description
			], response)
		});
	}
);

router.delete(
	"/nifi/controller/registry-client",
	body("registryClientName").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_nifi_registry_client_in_nifi",
                request.body.registryClientName
			], response)
		});
	}
);

export const controllerRoute = () => router