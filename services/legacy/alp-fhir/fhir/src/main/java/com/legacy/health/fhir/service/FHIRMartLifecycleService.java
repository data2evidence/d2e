package com.legacy.health.fhir.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.exception.InvalidRequestException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.queryengine.extension.MartControllerExtension;
import com.legacy.health.fhir.util.UUIDGenerator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FHIRMartLifecycleService extends AbstractService {

	@Autowired
	private UUIDGenerator uuidGenerator;

	private MartControllerExtension getMartController(String martType) {
		List<MartControllerExtension> martExtensions = getMartExtension();
		for (MartControllerExtension extension : martExtensions) {
			if (extension.getMetaData().getName().equals(martType)) {
				return extension;
			}
		}

		return null;
	}

	public void create(String schemaName, ObjectNode input) throws FhirException {
		if (!input.has("type") || !input.get("type").has("type")) {
			throw new InvalidRequestException("Expected property ['type'] in the request body.", null);
		}

		String martType = input.get("type").get("type").asText();
		MartControllerExtension controller = getMartController(martType);
		// Context context = getMartContext(schemaName, controller);

		if (!input.has("id")) {
			input.put("id", uuidGenerator.generateId());
		}
		if (controller != null) {
			controller.createDataMart(input.get("id").asText(), input, initializeRequestContext(schemaName));
		}
	}

	public void delete(String schemaName, String id) throws FhirException {
		MartControllerExtension controller = getMartController("sql");
		if (controller != null) {
			controller.deleteDataMart(id, initializeRequestContext(schemaName));
		}
	}

}
