package com.legacy.health.fhir.service.operations;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.meta.instance.Structure;

@Service("$deleteEndpoint")
public class DeleteEndPoint extends AbstractOperationExecutor {

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String resourceId) throws Exception {

		// check resource security authorization, scope
		HashMap<String, String> security = new HashMap<String, String>();
		security.put("scope", "FHIR_SCENARIO_ADMIN");
		security.put("attributeName", "endpoint");
		security.put("attributeValue", resourceId);

		ContentRepository repo = contentRepositoryFactory.getContentRepository();

		// load all the scenarios
		repo.getAllScenarios();

		Scenario scenario = repo.getScenarioForEndpoint(resourceId);

		if (scenario != null) {
			ScenarioDefinition def = scenario.getDefinition();
			String category = def.getCategory();

			FHIRResourceRepository resRepo = FHIRResourceRepository.getFHIRResourceRepoExtension(category);
			if (resRepo instanceof ContentRepositoryConsumer) {
				((ContentRepositoryConsumer) resRepo).setContentRepository(repo);
			}

			resRepo.deleteResource(resourceId, repo.getStructureDefinitionById(resourceType),
					initializeRequestContext(schemaName), null);

			// refresh the scenario cache after deletion
			repo.getAllScenarios(true);
		}

		return null;
	}

}
