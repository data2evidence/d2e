package com.legacy.health.fhir.service.operations;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.content.model.ScenarioDefinition.Deployment;
import com.legacy.health.fhir.content.model.ScenarioDefinition.Parameter;
import com.legacy.health.fhir.exception.InvalidRequestException;
import com.legacy.health.fhir.exception.InvalidResourceException;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;

@Service("$enableEndpoint")
public class EnableEndPoint extends AbstractOperationExecutor {

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType) throws FhirException, SQLException {

		JsonNode node = (input instanceof JSONStructure) ? ((JSONStructure) input).getRoot() : null;

		if (node == null) {
			throw new InvalidRequestException("Only JSON datatype is supported for operation $enableEndpoint", null);
		}

		if (!resourceType.equalsIgnoreCase("Scenario") || !input.getResourceType().equals("Scenario")) {
			throw new InvalidResourceException("Operation $enableEndpoint expects Scenario as resourceType", null);
		}

		validateScenarioCreationInput(node);
		String endpoint = getEndPointFromScenarioNode(node);

		// check resource security authorization, scope
		HashMap<String, String> security = new HashMap<String, String>();
		security.put("scope", "FHIR_SCENARIO_ADMIN");
		security.put("attributeName", "endpoint");
		security.put("attributeValue", endpoint);

		ContentRepository repo = contentRepositoryFactory.getContentRepository();
		if (input instanceof JSONStructure) {
			if ("Scenario".equals(node.path("resourceType").asText())) {
				Scenario scenario = new Scenario();
				scenario.setContentRepository(repo);
				scenario.fromJson(node);
				scenario.setResolved();

				ScenarioDefinition def = scenario.getDefinition();

				// check if user passed valid scope
				validateInputScopeAndParameters(node, def);

				String category = def.getCategory();
				FHIRResourceRepository resRepo = FHIRResourceRepository.getFHIRResourceRepoExtension(category);
				if (resRepo instanceof ContentRepositoryConsumer) {
					((ContentRepositoryConsumer) resRepo).setContentRepository(repo);
				}

				resRepo.doInit(input, initializeRequestContext(endpoint));

				// refresh the scenario cache after creation
				repo.getAllScenarios(true);

				return def.getCapabilities();
			}
		}

		return null;
	}

	private void validateInputScopeAndParameters(JsonNode inputNode, ScenarioDefinition def)
			throws InvalidRequestException {
		// check the scope is present in the set of scopes given
		for (JsonNode node : inputNode.get("scope")) {
			boolean flag = false;
			for (Deployment deployment : def.getDeployment()) {
				if (deployment.getScope().equals(node.asText())) {
					flag = true;
				}
			}
			if (flag == false) {
				throw new InvalidRequestException(
						"Scope " + node.asText() + " given in Scenario resource is invalid.", null);
			}
		}

		// check if the given parameter is present in the set of parameters given
		List<String> userParameters = new ArrayList<String>();
		for (JsonNode node : inputNode.get("parameter")) {
			userParameters.add(node.get("name").asText());
			boolean flag = false;
			for (Parameter param : def.getParameter()) {
				if (param.getName().endsWith(".groupId") && node.get("name").asText().endsWith(".groupId")) {
					flag = true;
				} else if (param.getName().equals(node.get("name").asText())) {
					flag = true;
				}
			}
			if (flag == false) {
				throw new InvalidRequestException(
						"Parameter " + node.get("name").asText() + " given in Scenario resource is invalid.", null);
			}
		}

		// check if all mandatory parameters needed are present
		List<String> requiredParams = new ArrayList<String>();
		for (Parameter param : def.getParameter()) {
			if (!param.getOptional() && !param.getName().endsWith(".groupId")
					&& !userParameters.contains(param.getName())) {
				requiredParams.add(param.getName());
			} else if (!param.getOptional() && param.getName().endsWith(".groupId")) {
				// check for groupId ( since it is an expression )
				if (!Arrays.stream(userParameters.toArray(new String[0]))
						.anyMatch(entry -> entry.endsWith(".groupId"))) {
					requiredParams.add(param.getName());
				}
			}
		}

		if (!requiredParams.isEmpty())
			throw new InvalidRequestException(
					"Scenario creation requires these mandatory parameters [" + String.join(",", requiredParams) + "]",
					null);
	}

	private void validateScenarioCreationInput(JsonNode node) throws FhirException {

		boolean fGroupIdPresent = false;
		boolean fSchemaPresent = false;
		// Valdation of Schema Names
		JsonNode parameters = node.path("parameter");
		for (JsonNode parameter : parameters) {
			if ((parameter.has("name") && parameter.get("name").asText().equals("endpoint")) ||
					(parameter.has("name") && parameter.get("name").asText().equals("schema"))) {

				if (parameter.get("name").asText().equals("schema")) {
					fSchemaPresent = true;
				}

				if (parameter.has("valueString") && parameter.get("valueString").asText().equalsIgnoreCase("content")) {
					throw new InvalidRequestException(
							"Endpoint/Schema Cannot have valueString [CONTENT]. It is a reserved name.", null);
				}
			}

			if (parameter.has("name") && parameter.get("name").asText().endsWith(".groupId")) {
				fGroupIdPresent = true;
			}
		}

		if (activeProfile.equalsIgnoreCase("xsa") && !fGroupIdPresent) {
			throw new InvalidRequestException(
					"Missing [ groupId ] in input. Scenario creation needs mandatory parameter [ <permission.id>.groupId ]",
					null);
		}

		if (!activeProfile.equalsIgnoreCase("xsa") && !fSchemaPresent) {
			throw new InvalidRequestException("Scenario creation needs mandatory parameter [ schema ]", null);
		} else if (activeProfile.equalsIgnoreCase("xsa") && fSchemaPresent) {
			throw new InvalidRequestException("Scenario creation does not need parameter [ schema ]", null);
		}
	}

	private String getEndPointFromScenarioNode(JsonNode node) throws FhirException {
		JsonNode parameters = node.path("parameter");
		for (JsonNode parameter : parameters) {
			if (parameter.has("name") && parameter.get("name").asText().equals("endpoint")) {
				return parameter.get("valueString").asText();
			}
		}
		return null;
	}

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String id) throws Exception {
		contentRepositoryFactory.getContentRepository();
		return null;
	}

}
