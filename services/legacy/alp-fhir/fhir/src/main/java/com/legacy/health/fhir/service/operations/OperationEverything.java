package com.legacy.health.fhir.service.operations;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;
import com.legacy.health.fhir.util.Utils;

@Service("$everything")
public class OperationEverything extends AbstractOperationExecutor {
	@Override
	public Structure execute(Map<String, String[]> requestParameters, Map<String, String[]> headers, Structure input,
			String schemaName, String resourceType, String id) throws Exception {

		// from security side TO DO retrieve only those resources which user has access
		// to. ( For optimization )
		// TO START WITH check resource security authorization
		// search of resource
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "search");
		operation.put("operationValue", "$everything");

		if (repository.getStructureDefinitionById(resourceType) == null) {
			throw new ResourceTypeNotSupportedException(
					String.format("Resource Type [%s] Not Supported.", resourceType), null);
		}

		id = Utils.checkUUID(id);
		StructureDefinition typeSD = queryBuilder.sd(resourceType);
		ResultElement fullResource = queryBuilder.out(typeSD);
		ResultElement idAttribute = queryBuilder.out(typeSD, resourceType + ".id");
		StringExpression idValue = queryBuilder.string(id);

		Query query = queryBuilder.query("Get Resource By Id")
				.from(queryBuilder.from(typeSD))
				.filter(queryBuilder.eq(idAttribute, idValue))
				.out(fullResource);
		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();

		Scenario scenario = repo.getScenarioForEndpoint(schemaName);
		QueryExecutorExtension executor = null;
		ScenarioContext scenarioCtx = null;
		if (scenario != null) {
			String category = scenario.getDefinition().getCategory();
			scenarioCtx = new ScenarioContext();
			scenarioCtx.setScenario(scenario);
			scenarioCtx.setInstanceAuthorizationHook(this.authorizationHook);
			executor = getQueryExecutorExtension(category);
			if (executor instanceof ContentRepositoryConsumer) {
				((ContentRepositoryConsumer) executor).setContentRepository(repo);
			}
		} else {
			executor = this.getQueryExecutorExtension();
		}

		String start = null;
		if (requestParameters.containsKey("start")) {
			start = requestParameters.get("start")[0];
		}
		String end = null;
		if (requestParameters.containsKey("end")) {
			end = requestParameters.get("end")[0];
		}

		query.everything(start, end);
		return executor.doQuery(query, initializeRequestContext(schemaName), true, scenarioCtx);
	}

}
