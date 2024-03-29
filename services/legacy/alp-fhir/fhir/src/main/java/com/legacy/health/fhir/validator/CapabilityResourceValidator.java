package com.legacy.health.fhir.validator;

import java.util.ArrayList;
import java.util.HashMap;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.legacy.health.fhir.extension.CapabilityValidatorExtension;
import com.legacy.health.fhir.extension.ExtensionMetadata;
import com.legacy.health.fhir.extension.exceptions.CapabilityValidationException;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.Issue.Severity;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONWalker;

public class CapabilityResourceValidator implements CapabilityValidatorExtension {

	// Structure serverCapability;
	// String interaction;
	// String[] operands;
	OperationOutcome outcome = new OperationOutcome();

	@Override
	public ExtensionMetadata getMetaData() {
		// TODO Auto-generated method stub
		return new ExtensionMetadata("CapabilityResourceValidator", "1.0", "Check Capability Validator");
	}

	@Override
	public com.legacy.health.fhir.meta.entity.OperationOutcome validate(Structure capabilityStatement,
			String resourceType,
			String operationType,
			HashMap<String, ArrayList<String>> searchOperands) throws CapabilityValidationException {

		// check if the resource type is listed to be served by the server
		boolean bFlagResourceServable = this.checkResourceIsServable(resourceType, capabilityStatement);
		if (bFlagResourceServable) {
			Issue issue = new Issue(Severity.information, "valid");
			issue.setDiagnostics(resourceType + ": is servable by the FHIR Server");
			outcome.addIssue(issue);
		} else {
			Issue issue = new Issue(Severity.error, "invalid");
			issue.setDiagnostics(resourceType + ": is not servable by the FHIR Server");
			outcome.addIssue(issue);
		}

		// check if the operation is served for the given resource by the server
		if (bFlagResourceServable) {
			this.checkResourceOperation(resourceType, capabilityStatement, operationType, searchOperands);
		}

		return outcome;
	}

	private void checkResourceOperation(String resourceType, Structure serverCapability, String interaction,
			HashMap<String, ArrayList<String>> searchOperands) {
		if (serverCapability != null) {
			ArrayList<String> searchParams = (searchOperands != null && searchOperands.containsKey("searchParam"))
					? searchOperands.get("searchParam")
					: null;
			ArrayList<String> searchIncludes = (searchOperands != null && searchOperands.containsKey("searchInclude"))
					? searchOperands.get("searchInclude")
					: null;
			ArrayList<String> searchRevIncludes = (searchOperands != null
					&& searchOperands.containsKey("searchRevInclude")) ? searchOperands.get("searchRevInclude") : null;

			JsonNode jsonCapabilityNode = new JSONWalker().toJSON(serverCapability);

			JsonNode server = this.getNode((ArrayNode) jsonCapabilityNode.get("rest"), "mode", "server");
			JsonNode resource = (server != null)
					? this.getNode((ArrayNode) server.get("resource"), "type", resourceType)
					: null;

			JsonNode operation = (resource != null)
					? this.getNode((ArrayNode) resource.get("interaction"), "code", interaction)
					: null;
			if (operation != null) {
				Issue issue = new Issue(Severity.information, "valid");
				issue.setDiagnostics(
						interaction + ": Operation for resource: " + resourceType + " is servable by the FHIR Server");
				outcome.addIssue(issue);
			} else {
				Issue issue = new Issue(Severity.error, "invalid");
				issue.setDiagnostics(interaction + ": Operation for resource: " + resourceType
						+ " is not servable by the FHIR Server");
				outcome.addIssue(issue);
			}

			// search param check
			if (searchParams != null) {
				for (String searchParam : searchParams) {
					JsonNode operandNode = (resource != null)
							? this.getNode((ArrayNode) resource.get("searchParam"), "name", searchParam)
							: null;
					if (operandNode != null) {
						Issue issue = new Issue(Severity.information, "valid");
						issue.setDiagnostics(searchParam + " in Search Operation: " + interaction + " for resource: "
								+ resourceType + " is servable by the FHIR Server");
						outcome.addIssue(issue);
					} else {
						Issue issue = new Issue(Severity.error, "invalid");
						issue.setDiagnostics(searchParam + " in Search Operation: " + interaction + " for resource: "
								+ resourceType + " is not servable by the FHIR Server");
						outcome.addIssue(issue);
					}
				}
			}

			// search include param check
			if (searchIncludes != null) {
				for (String searchInclude : searchIncludes) {
					searchInclude = searchInclude.replace(":", "."); // convert Observation:subject to
																		// Observation.subject
					JsonNode operandNode = (resource != null)
							? this.getNode((ArrayNode) resource.get("searchInclude"), null, searchInclude)
							: null;
					if (operandNode != null) {
						Issue issue = new Issue(Severity.information, "valid");
						issue.setDiagnostics(searchInclude + " in Search Include Operation: " + interaction
								+ " for resource: " + resourceType + " is servable by the FHIR Server");
						outcome.addIssue(issue);
					} else {
						Issue issue = new Issue(Severity.error, "invalid");
						issue.setDiagnostics(searchInclude + " in Search Include Operation: " + interaction
								+ " for resource: " + resourceType + " is not servable by the FHIR Server");
						outcome.addIssue(issue);
					}
				}
			}

			// search rev include param check
			if (searchRevIncludes != null) {
				for (String searchRevInclude : searchRevIncludes) {
					searchRevInclude = searchRevInclude.replace(":", "."); // convert Observation:subject to
																			// Observation.subject
					JsonNode operandNode = (resource != null)
							? this.getNode((ArrayNode) resource.get("searchRevInclude"), null, searchRevInclude)
							: null;
					if (operandNode != null) {
						Issue issue = new Issue(Severity.information, "valid");
						issue.setDiagnostics(searchRevInclude + " in Search Reverse Include Operation: " + interaction
								+ " for resource: " + resourceType + " is servable by the FHIR Server");
						outcome.addIssue(issue);
					} else {
						Issue issue = new Issue(Severity.error, "invalid");
						issue.setDiagnostics(searchRevInclude + " in Search Reverse Include Operation: " + interaction
								+ " for resource: " + resourceType + " is not servable by the FHIR Server");
						outcome.addIssue(issue);
					}
				}
			}
		}
	}

	private boolean checkResourceIsServable(String resourceType, Structure serverCapability) {
		boolean flagServable = false;
		if (serverCapability != null) {
			JsonNode jsonCapabilityNode = new JSONWalker().toJSON(serverCapability);

			JsonNode server = this.getNode((ArrayNode) jsonCapabilityNode.get("rest"), "mode", "server");
			JsonNode resource = (server != null)
					? this.getNode((ArrayNode) server.get("resource"), "type", resourceType)
					: null;

			if (resource != null) {
				flagServable = true;
			} else {
				flagServable = false;
			}
		}
		return flagServable;
	}

	@SuppressWarnings("unlikely-arg-type")
	private JsonNode getNode(JsonNode jsonNode, String key, String value) {

		if (jsonNode.isArray()) {
			for (JsonNode node : jsonNode) {
				if (key != null && node.get(key).asText().equals(value)) {
					return node;
				} else if (node.asText().equals(value)) {
					return node;
				}
			}
		} else {
			if (jsonNode.get(key).asText().equals(value)) {
				return jsonNode.get(key);
			} else {
				return null;
			}
		}

		return null;
	}

}
