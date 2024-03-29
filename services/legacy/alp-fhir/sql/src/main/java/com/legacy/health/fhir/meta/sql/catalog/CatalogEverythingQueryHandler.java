package com.legacy.health.fhir.meta.sql.catalog;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.legacy.health.fhir.content.ScenarioContext;
import com.legacy.health.fhir.content.model.ScenarioDefinition;
import com.legacy.health.fhir.content.model.ScenarioDefinition.Deep;
import com.legacy.health.fhir.content.model.ScenarioDefinition.PatientEverything;
import com.legacy.health.fhir.meta.AuthorizationException;
import com.legacy.health.fhir.meta.ResourceTypeNotSupportedException;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.RequestContext;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.instance.Structure;
import com.legacy.health.fhir.meta.json.JSONStructure;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.InstanceAuthorizationHook;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;

public class CatalogEverythingQueryHandler {

	private static final Logger log = LoggerFactory.getLogger(CatalogEverythingQueryHandler.class);

	private void wrapAuthenticationHook(Query query, ScenarioContext scenarioContext, String schema)
			throws ResourceTypeNotSupportedException, AuthorizationException, SQLException, FhirException {
		StructureDefinition sd = query.from().getStructureDefinition();
		InstanceAuthorizationHook instanceAuthorization = scenarioContext.getAuthorizationHook();
		if (instanceAuthorization != null) {
			instanceAuthorization.injectInstanceAuthorization(schema, sd.getId(), query);
		}

	}

	void handleEverythingQuery(Query query, RequestContext rctx, ScenarioContext scenarioContext,
			CatalogQueryExecutor executor, ArrayNode result, String schema)
			throws SQLException, FhirException {
		QueryBuilder qb = query.getQueryBuilder();
		StringExpression idValue = null;
		StructureDefinition typeSD = query.from().getStructureDefinition();
		this.wrapAuthenticationHook(query, scenarioContext, schema);
		Structure baseResult = executor.doQuery(query, rctx, true, scenarioContext, false);
		if ("Bundle".equals(baseResult.getDefinition().getId()) && baseResult instanceof JSONStructure) {
			ObjectNode body = (ObjectNode) ((JSONStructure) baseResult).getRoot();
			String id = body.path("entry").path(0).path("resource").path("id").asText(null);
			if (id != null && body.path("entry").size() == 1) {
				idValue = qb.string(id);
			} else {
				if (body.path("entry").size() > 1) {
					throw new FhirException(
							"Patient everything is only supprted for singular identified Patients", null);
				} else {
					return;
				}
			}
		}
		List<Structure> results = new ArrayList<Structure>();
		results.add(baseResult);
		Query baseQuery = query;
		ScenarioDefinition ssd = scenarioContext.getScenario().getDefinition();
		List<PatientEverything> list = ssd.getPatientEverything();
		for (PatientEverything include : list) {
			StructureDefinition isd = include.getDefinition();
			String dataElement = include.getElement();
			ResultElement fullResource = qb.out(isd);
			String dateElement = include.getDateElement();
			Expression includeExpression = createDateFilter(baseQuery, qb, isd, dateElement);
			if (dataElement.startsWith(isd.getId())) {
				ResultElement parentAttribute = qb.out(isd, dataElement);
				Expression expression = qb.eq(parentAttribute, idValue);

				expression = includeExpression == null ? expression : qb.and(expression, includeExpression);
				query = qb.query("Get Resource By Id")
						.from(qb.from(isd))
						.filter(expression).out(fullResource);

				this.wrapAuthenticationHook(query, scenarioContext, schema);
				results.add(executor.doQuery(query, rctx, true, scenarioContext));
				List<Deep> deepIncludes = include.getDeep();
				for (Deep deep : deepIncludes) {
					StructureDefinition dsd = deep.getDefinition();
					String deepDataElement = deep.getElement();
					String deepDateElement = deep.getDateElement();
					fullResource = qb.out(dsd);
					if (deepDataElement.startsWith(dsd.getId())) {
						log.warn(
								"Link for Patient Everything where the deep resource links to the parent attribute is not yet supporte");
					} else {
						Expression deepIncludeExpression = createDateFilter(baseQuery, qb, dsd, deepDateElement);
						Expression deepExpression = qb.eq(parentAttribute, idValue);
						deepExpression = deepIncludeExpression == null ? deepExpression
								: qb.and(deepExpression, deepIncludeExpression);
						deepExpression = includeExpression == null ? deepExpression
								: qb.and(deepExpression, includeExpression);
						query = qb.query("Get Reverse Link")
								.from(qb.from(dsd))
								.join(qb.join(isd, deepDataElement))
								.filter(
										deepExpression)
								.out(fullResource);
						this.wrapAuthenticationHook(query, scenarioContext, schema);
						results.add(executor.doQuery(query, rctx, true, scenarioContext));

					}
				}
			} else {
				ResultElement typeAttribute = qb.out(typeSD, typeSD.getId() + ".id");
				Expression expression = qb.eq(typeAttribute, idValue);

				expression = includeExpression == null ? expression : qb.and(expression, includeExpression);
				query = qb.query("Get Reverse Link")
						.from(qb.from(isd))
						.join(qb.join(typeSD, dataElement))
						.filter(expression)
						.out(fullResource);
				this.wrapAuthenticationHook(query, scenarioContext, schema);
				results.add(executor.doQuery(query, rctx, true, scenarioContext));
			}
		}
		for (Structure s : results) {
			if (s instanceof JSONStructure) {
				if ("Bundle".equals(s.getDefinition().getId())) {
					JSONStructure js = (JSONStructure) s;
					ObjectNode bundle = (ObjectNode) js.getRoot();
					ArrayNode entries = (ArrayNode) bundle.get("entry");
					for (JsonNode jsonNode : entries) {
						result.add(jsonNode.deepCopy());
					}
				}
			}
		}
	}

	private Expression createDateFilter(Query query, QueryBuilder qb, StructureDefinition isd, String dateElement) {
		Expression includeExpression = null;
		if (dateElement != null) {
			ResultElement parentDateElement = qb.out(isd, dateElement);

			if (query.getEverythingStartDate() != null) {
				includeExpression = qb.binary(parentDateElement,
						">=",
						qb.string(query.getEverythingStartDate()));
			}
			if (query.getEverythingEndDate() != null) {
				Expression endDate = qb.binary(parentDateElement,
						"<=",
						qb.string(query.getEverythingEndDate()));
				includeExpression = includeExpression == null ? endDate : qb.and(includeExpression, endDate);
			}
		}
		return includeExpression;
	}

}
