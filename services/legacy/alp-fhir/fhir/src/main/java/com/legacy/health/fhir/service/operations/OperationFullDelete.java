package com.legacy.health.fhir.service.operations;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.exception.ResourceNotFoundForDeletion;
import com.legacy.health.fhir.extension.FHIRResourceRepository;
import com.legacy.health.fhir.helper.FhirUtils;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.Issue;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.service.FHIRResourceService;
import com.legacy.health.fhir.service.FHIRSearchService;
import com.legacy.health.fhir.util.UUIDGeneratorImpl;
import com.legacy.health.fhir.util.Utils;

@Service("$fulldelete")
public class OperationFullDelete extends AbstractOperationExecutor {

	@Autowired
	private FHIRSearchService searchService;

	private @Autowired HttpServletRequest request;

	@Autowired
	FHIRResourceService resourceService;

	private static final Logger log = Logger.getLogger(OperationFullDelete.class);

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String id) throws Exception {

		HashMap<String, String> security = new HashMap<String, String>();
		security.put("scope", "FHIR_COMPLETE_PATIENT_DELETE_ADMIN");

		if (repository.getStructureDefinitionById(resourceType) == null) {
			throw new ResourceTypeNotSupportedException(
					String.format("Resource Type [%s] Not Supported.", resourceType), null);
		}

		if (!"Patient".equals(resourceType)) {
			throw new ResourceTypeNotSupportedException(
					String.format("Resource Type [%s] Not Supported.", resourceType), null);
		}

		OperationOutcome outcome = new OperationOutcomeBuilder().withIDGenerator(new UUIDGeneratorImpl())
				.addIssue(Issue.Severity.information, "informational")
				.withDetails("Try to delete Patient with id " + id).issue().outcome();

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

		String schema = schemaName;
		if (!activeProfile.equals("xsa")) {
			schema = getParamFromScenario(scenario, "schema");
		}
		id = Utils.checkUUID(id);
		checkEntryExists(schemaName, schema, resourceType, id, !(scenario == null), scenario);

		resRepo.fullDeletePatient(id, initializeRequestContext(getParamFromScenario(scenario, "endpoint")), null);

		outcome = new OperationOutcomeBuilder().withIDGenerator(new UUIDGeneratorImpl())
				.addIssue(Issue.Severity.information, "informational").withDetails("Deleted Patient with id " + id)
				.issue().outcome();

		Structure ret = FhirUtils.toStructure(outcome);
		return ret;
	}

	private void checkEntryExists(String endpoint, String schemaName, String resourceType, String id, boolean isCatalog,
			Scenario scenario) throws SQLException, FhirException {
		// TODO Auto-generated method stub

		Map<String, String[]> parameters = new HashMap<>();
		parameters.put("_id", new String[] { id });

		Query query = searchExecutor.doSearch(resourceType, parameters, repository, isCatalog);

		QueryExecutorExtension executor = null;
		ScenarioContext scenarioCtx = null;
		if (isCatalog) {
			executor = getQueryExecutorExtension("catalog");
			ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
			if (executor instanceof ContentRepositoryConsumer) {
				((ContentRepositoryConsumer) executor).setContentRepository(repo);
			}
			scenarioCtx = new ScenarioContext();
			scenarioCtx.setScenario(scenario);
		} else {
			executor = getQueryExecutorExtension();
		}

		Structure structure = executor.doQuery(query, initializeRequestContext(endpoint), true, scenarioCtx);

		if (structure != null) {
			JsonNode bundleAsJson = FhirUtils.toJson(structure);

			JsonNode entries = bundleAsJson.get("entry");

			if (entries.size() == 0) {
				throw new ResourceNotFoundForDeletion(
						String.format("Resource [%s] with id [%s] not found.", resourceType, id), null);
			}
		} else {
			throw new ResourceNotFoundForDeletion(
					String.format("Resource [%s] with id [%s] not found.", resourceType, id), null);
		}
	}

	protected String getParamFromScenario(Scenario scenario, String param) {
		List<Scenario.Parameter> list = scenario.getParameter();
		for (Scenario.Parameter parameter : list) {
			if (param.equals(parameter.getName())) {
				return parameter.getValueString();
			}
		}
		return null;
	}

}
