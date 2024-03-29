package com.legacy.health.fhir.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.legacy.health.fhir.content.ContentRepository;
import com.legacy.health.fhir.content.ContentRepositoryConsumer;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.Scenario;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.OperationOutcomeBuilder;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.OperationOutcome;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.queryengine.Parameter;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.extension.QueryExecutorExtension;

@Service
public class FHIRSearchService extends AbstractService {

	protected final Logger log = LoggerFactory.getLogger(FHIRSearchService.class);

	@Autowired
	private FHIRResourceValidatorService validatorService;

	@Transactional(readOnly = true)
	public Structure search(String schema, String resourceType, Map<String, String[]> parameters)
			throws SQLException, FhirException {

		// check resource security authorization
		// read for multiple records
		// ( FIRST Security Check If API is accessable )
		HashMap<String, String> operation = new HashMap<String, String>();
		operation.put("operation", "search");

		if (repository.getStructureDefinitionById(resourceType) == null) {
			throw new ResourceTypeNotSupportedException(String.format("Resource Type [%s] Not Supported", resourceType),
					null);
		}

		ContentRepository repo = this.contentRepositoryFactory.getContentRepository();

		Scenario scenario = repo.getScenarioForEndpoint(schema);
		String phsSchema = null;
		ScenarioContext scenarioCtx = null;
		QueryExecutorExtension executor = null;
		boolean isCatalog = false;
		if (scenario != null) {

			phsSchema = repo.getParameterValue(scenario, "schema");
			assert environment.getActiveProfiles().length == 1;
			activeProfile = environment.getActiveProfiles()[0];
			if (activeProfile.equals("xsa")) {
				phsSchema = schema; // due to the use of instance manager, physical schema is obtained from the
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
		} else {
			phsSchema = schema;
		}

		Query query = searchExecutor.doSearch(resourceType, parameters, repository, isCatalog);

		checkCapabilityForSearch(resourceType, query, schema);

		doSecurityCheck4Include_Revinclude(resourceType, query, schema);

		this.injectInstanceAuthorization(phsSchema, resourceType, query);

		// //enforceCount if parameter does not have count; default: 300
		// this.enforceLimit(query, parameters);

		if (executor != null) {
			return executor.doQuery(query, initializeRequestContext(phsSchema), true, scenarioCtx);
		} else {
			return getQueryExecutorExtension().doQuery(query, initializeRequestContext(schema), true, null);
		}

	}

	// private void enforceLimit(Query query, Map<String, String[]> parameters) {
	// if(!parameters.containsKey("_count")) {
	// Integer count = ENFORCED_RESULT_LIMIT;
	// Integer skip = null;
	// if (parameters.containsKey("_skip")) {
	// skip = Integer.parseInt(parameters.get("_skip")[0]);
	// }
	// QueryBuilder qb = new QueryBuilder();
	// query.limit(qb.limit(count, skip));
	// }
	// }

	private void checkCapabilityForSearch(String resourceType, Query query, String schema)
			throws FhirException, SQLException {
		// validate capability for an endpoint
		HashMap<String, ArrayList<String>> searchOperands = new HashMap<String, ArrayList<String>>();
		List<Parameter> params = query.getParameters();
		ArrayList<String> parameters = new ArrayList<String>();
		for (Parameter parameter : params) {
			parameters.add(parameter.getName());
		}
		// ArrayList<String> parameter =
		searchOperands.put("searchParam", parameters);
		validatorService.validateCapabilityAgainstEndpoint(schema, resourceType, "search-type", null,
				contentRepositoryFactory, searchExecutor, repository, connectionProperties);
	}

	private void doSecurityCheck4Include_Revinclude(String resourceType, Query query, String schema)
			throws FhirException, SQLException {

		if (query.getIncludes() != null && query.getIncludes().size() > 0) {
			ListIterator<ResultElement> elements = query.getIncludes().listIterator();
			iterateResultSet(elements, schema);
		}

		if (query.getRevIncludes() != null && query.getRevIncludes().size() > 0) {
			ListIterator<ResultElement> elements = query.getRevIncludes().listIterator();
			iterateResultSet(elements, schema);
		}
	}

	private void iterateResultSet(ListIterator<ResultElement> iterator, String schema)
			throws SQLException, FhirException {
		while (iterator.hasNext()) {
			ResultElement element = iterator.next();
			doSecurityChecks(element, schema);
		}
	}

	private void doSecurityChecks(ResultElement resultElement, String schema)
			throws SQLException, FhirException {
		String resourceType = resultElement.getStructureDefinition().getId();
		log.debug(" Security check for resource :  " + resourceType);
	}

	public OperationOutcome toOperationOutcome(FhirException ex) {
		return new OperationOutcomeBuilder().addIssue(ex.getSeverity(), ex.getIssueType())
				.withDetails(ex).issue().outcome();

	}

}