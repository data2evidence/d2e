package com.legacy.health.fhir.service.operations;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.util.Utils;

@Service("$fullget")
public class OperationFullGet extends AbstractOperationExecutor {
	private static final Logger log = Logger.getLogger(OperationFullGet.class);

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String id) throws Exception {

		HashMap<String, String> security = new HashMap<String, String>();
		security.put("scope", "FHIR_COMPLETE_PATIENT_READ_ADMIN");

		if (repository.getStructureDefinitionById(resourceType) == null) {
			throw new ResourceTypeNotSupportedException(
					String.format("Resource Type [%s] Not Supported.", resourceType), null);
		}

		if (!"Patient".equals(resourceType)) {
			throw new ResourceTypeNotSupportedException(
					String.format("Resource Type [%s] Not Supported.", resourceType), null);
		}

		id = Utils.checkUUID(id);

		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
		Scenario scenario = repo.getScenarioForEndpoint(schemaName);

		if (scenario == null) {
			throw new AuthorizationException("No scenario found for endpoint: " + schemaName, null);
		}

		ScenarioDefinition def = scenario.getDefinition();
		String category = def.getCategory();
		FHIRResourceRepository resRepo = FHIRResourceRepository.getFHIRResourceRepoExtension(category);
		if (resRepo instanceof ContentRepositoryConsumer) {
			((ContentRepositoryConsumer) resRepo).setContentRepository(repo);
		}
		Structure node = resRepo.fullGetPatient(id, initializeRequestContext(getEndpoint(scenario)), null);
		return node;
	}

	protected String getEndpoint(Scenario scenario) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if ("endpoint".equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

}
