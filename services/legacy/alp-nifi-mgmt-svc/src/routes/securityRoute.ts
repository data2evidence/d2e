import express from "express";
import { param, body } from "express-validator";
import { appConfig } from "../utils/config";
import { executePythonNifiModule, validationResultCheck } from "../utils/common";

const router = express.Router();

router.get(
	"/nifi/security/users",
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_users",
				"nifi"
			], response);
		});
	}
);

router.get(
	"/nifi/security/user/:userIdentity", 
	param("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user", 
				request.params.userIdentity, 
				"nifi"
			], response);
		});
	}
);

router.get(
	"/nifi/security/user/user-group-identities/:userIdentity",
	param("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
	  validationResultCheck(request, response, () => {
		executePythonNifiModule(
		  [
			appConfig.PYTHON_NIFI_MODULE,
			"get_user_group_identities",
			request.params.userIdentity,
			"nifi",
		  ],
		  response
		);
	  });
	}
  );

router.get(
	"/nifi/security/user-groups",
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user_groups",
				"nifi"
			], response);
		});
	}
);

router.get(
	"/nifi/security/user-group/:userGroupIdentity", 
	param("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user_group", 
				request.params.userGroupIdentity, 
				"nifi"
			], response);
		});
	}
);

router.get(
	"/nifi-registry/security/users",
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_users",
				"registry"
			], response);
		});
	}
);

router.get(
	"/nifi-registry/security/user/:userIdentity", 
	param("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user", 
				request.params.userIdentity, 
				"registry"
			], response);
		});
	}
);

router.get(
	"/nifi-registry/security/user/user-group-identities/:userIdentity",
	param("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
	  validationResultCheck(request, response, () => {
		executePythonNifiModule(
		  [
			appConfig.PYTHON_NIFI_MODULE,
			"get_user_group_identities",
			request.params.userIdentity,
			"registry",
		  ],
		  response
		);
	  });
	}
  );

router.get(
	"/nifi-registry/security/user-groups",
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user_groups",
				"registry"
			], response);
		});
	}
);

router.get(
	"/nifi-registry/security/user-group/:userGroupIdentity", 
	param("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"get_user_group", 
				request.params.userGroupIdentity, 
				"registry"
			], response);
		});
	}
);

router.post(
	"/nifi/security/user", 
	body("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_new_user", 
				request.body.userIdentity, 
				"nifi"
			], response);
		});
	}
);

router.post(
	"/nifi/security/user-group",
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_new_user_group", 
				request.body.userGroupIdentity, 
				"nifi"
			], response);
		});
	}
);

router.post(
	"/nifi-registry/security/user",
	body("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_new_user", 
				request.body.userIdentity, 
				"registry"
			], response);
		});
	}
);

router.post(
	"/nifi-registry/security/user-group",
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"create_new_user_group", 
				request.body.userGroupIdentity, 
				"registry"
			], response);
		});
	}
);


router.put(
	"/nifi/security/user/update-identity",
	body("userIdentity").trim().notEmpty(),
	body("newUserIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"update_user_identity", 
				request.body.userIdentity, 
				request.body.newUserIdentity, 
				"nifi"
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user/update-identity", 
	body("userIdentity").trim().notEmpty(),
	body("newUserIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE,
				"update_user_identity",
				request.body.userIdentity,
				request.body.newUserIdentity,
				"registry"
			], response);
		});
	}
);

router.put(
	"/nifi/security/user-group/update-identity",
	body("userGroupIdentity").trim().notEmpty(),
	body("newUserGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE,
				"update_user_group_identity",
				request.body.userGroupIdentity,
				request.body.newUserGroupIdentity,
				"nifi"
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user-group/update-identity",
	body("userGroupIdentity").trim().notEmpty(),
	body("newUserGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE,
				"update_user_group_identity",
				request.body.userGroupIdentity,
				request.body.newUserGroupIdentity,
				"registry"
			], response);
		});
	}
);

router.put(
	"/nifi/security/user/:intent/user-group",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_user_group_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.userGroupIdentity, 
				"nifi"
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user/:intent/user-group",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_user_group_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.userGroupIdentity, 
				"registry"
			], response);
		});
	}
);

router.put(
	"/nifi/security/user/:intent/access-policy",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE,
				"modify_user_to_nifi_access_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi/security/user/:intent/process-group-access-policy",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("processGroupName").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_process_group_access_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.processGroupName, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user/:intent/resource-policy",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_registry_resource_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user/:intent/bucket-policy",
	param("intent").trim().notEmpty(),
	body("userIdentity").trim().notEmpty(),
	body("bucketName").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_registry_bucket_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userIdentity, 
				request.body.bucketName, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi/security/user-group/:intent/access-policy",
	param("intent").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_access_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userGroupIdentity, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi/security/user-group/:intent/process-group-access-policy",
	param("intent").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	body("processGroupName").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_process_group_access_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userGroupIdentity, 
				request.body.processGroupName, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user-group/:intent/resource-policy",
	param("intent").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_registry_resource_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userGroupIdentity, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);

router.put(
	"/nifi-registry/security/user-group/:intent/bucket-policy",
	param("intent").trim().notEmpty(),
	body("userGroupIdentity").trim().notEmpty(),
	body("bucketName").trim().notEmpty(),
	body("resource").trim().notEmpty(),
	body("action").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"modify_user_to_nifi_registry_bucket_policy_relationship", 
				request.params.intent.toLowerCase(), 
				request.body.userGroupIdentity, 
				request.body.bucketName, 
				request.body.resource.toLowerCase(), 
				request.body.action.toLowerCase()
			], response);
		});
	}
);


router.delete(
	"/nifi/security/user",
	body("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"remove_user", 
				request.body.userIdentity, 
				"nifi"
			], response);
		});
	}
);

router.delete(
	"/nifi-registry/security/user",
	body("userIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"remove_user", 
				request.body.userIdentity, 
				"registry"
			], response);
		});
	}
);

router.delete(
	"/nifi/security/user-group",
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"remove_user_group", 
				request.body.userGroupIdentity, 
				"nifi"
			], response);
		});
	}
);

router.delete(
	"/nifi-registry/security/user-group",
	body("userGroupIdentity").trim().notEmpty(),
	(request: express.Request, response: express.Response) => {
		validationResultCheck(request, response, () => {
			executePythonNifiModule([
				appConfig.PYTHON_NIFI_MODULE, 
				"remove_user_group", 
				request.body.userGroupIdentity, 
				"registry"
			], response);
		});
	}
);

export const securityRoute = () => router