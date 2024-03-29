package com.legacy.health.fhir.service.operations;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.service.FHIRSearchService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("$lastn")
public class OperationLastN extends AbstractOperationExecutor {

	@Autowired
	private FHIRSearchService searchService;

	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType) throws Exception {

		// check resource security authorization
		// read for single record and operation lastN Check
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "search");
		operation.put("operationValue", "$lastn");

		if (!resourceType.equals("Observation")) {
			throw new UnsupportedOperationException("Operation $lastn is only supported for resourceType Observation");
		}

		if (repository.getStructureDefinitionById(resourceType) == null) {
			throw new ResourceTypeNotSupportedException(String.format("Resource Type [%s] Not Found.", resourceType),
					null);
		}

		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();
		Scenario scenario = repo.getScenarioForEndpoint(schemaName);
		QueryExecutorExtension executor = null;
		String phsSchema = null;
		ScenarioContext scenarioCtx = null;
		boolean isCatalog = false;

		if (scenario != null) {
			phsSchema = repo.getParameterValue(scenario, "schema");
			if (activeProfile.equals("xsa")) {
				phsSchema = schemaName; // due to the use of instance manager, physical schema is obtained from the
										// endpoint name
			}
			String category = scenario.getDefinition().getCategory();
			scenarioCtx = new ScenarioContext();
			scenarioCtx.setScenario(scenario);
			executor = getQueryExecutorExtension(category);
			if (executor instanceof ContentRepositoryConsumer) {
				((ContentRepositoryConsumer) executor).setContentRepository(repo);
			}

			isCatalog = true;
		}

		int max = 1;
		if (requestParameters.containsKey("max")) {
			max = Integer.parseInt(requestParameters.get("max")[0]);
		}

		Query query = searchExecutor.doSearch(resourceType, requestParameters, repository, isCatalog);

		// instance Authorization enabled
		searchService.injectInstanceAuthorization(schemaName, resourceType, query);

		StructureDefinition sd = repository.getStructureDefinitionById(resourceType);
		// DataElement time = sd.getDataElement("effectiveDateTime");
		ResultElement orderBy = queryBuilder.out(sd, resourceType + ".effectiveDateTime");
		ResultElement partition = queryBuilder.out(sd, resourceType + ".code.coding.code");

		query.out(queryBuilder.rownum(partition, orderBy).desc().label("rownum"));
		query.lastn(max);

		if (executor != null) {
			return executor.doQuery(query, initializeRequestContext(phsSchema), true, scenarioCtx);
		} else {
			return getQueryExecutorExtension().doQuery(query, initializeRequestContext(schemaName), true, null);
		}

	}

}
