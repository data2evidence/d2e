package com.legacy.health.fhir.executor;

import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;

import org.springframework.beans.factory.annotation.Autowired;

import com.legacy.health.fhir.executor.SearchHelper.SearchContext;
import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Parameter;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;
import com.legacy.health.fhir.meta.queryengine.ResultElement;
import com.legacy.health.fhir.meta.queryengine.StringExpression;
import com.legacy.health.fhir.meta.repsitory.MetaRepository;
import com.legacy.health.fhir.util.Utils;

public class SearchExecutor {

	@Autowired
	private Integer queryResultLimit;

	public Query doSearch(String type, Map<String, String[]> parameters, MetaRepository repo, boolean isCatalog)
			throws FhirException {

		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);
		StructureDefinition typeSD = qb.sd(type);
		ResultElement fullResource = qb.out(typeSD);
		Set<String> keys = parameters.keySet();
		Query query = qb.query("Search").from(qb.from(type)).out(fullResource);
		Integer count = null;
		if (parameters.containsKey("_count")) {
			count = Integer.parseInt(parameters.get("_count")[0]);
		} else {
			count = queryResultLimit;
		}
		Integer skip = null;
		if (parameters.containsKey("_skip")) {
			skip = Integer.parseInt(parameters.get("_skip")[0]);
		}
		query.limit(qb.limit(count, skip));
		Expression expression = null;
		for (String key : keys) {
			if (key.equals("_sort")) {
				String[] outerValues = parameters.get(key);
				for (int j = 0; j < outerValues.length; j++) {
					String[] sortValues = outerValues[j].split(",");
					for (int i = 0; i < sortValues.length; i++) {
						String sortValue = sortValues[i];
						boolean descending = false;
						if (sortValue.startsWith("-")) {
							descending = true;
							sortValue = sortValue.substring(1);
						}
						SearchParameter sp = repo.getSearchParameterByTypeAndCode(typeSD, sortValue);
						SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
						ResultElement sortAttribute = qb.out(typeSD, ctx.path);

						query.sortBy(qb.sort(sortAttribute, descending));
					}
				}

				continue;
			}
			if (key.equals("_lastUpdated")) {
				String[] outerValues = parameters.get(key);
				LastUpdatedHandler luh = new LastUpdatedHandler();
				luh.setQueryBuilder(qb);
				expression = luh.search(typeSD, expression, outerValues, key);
				continue;
			}
			if (key.equals("_elements")) {
				String[] outerValues = parameters.get(key);
				for (int j = 0; j < outerValues.length; j++) {
					String[] elementValues = outerValues[j].split(",");

					for (int i = 0; i < elementValues.length; i++) {
						String elementValue = elementValues[i];
						ResultElement elementAttribute = qb.out(typeSD, typeSD.getId() + "." + elementValue);
						query.element(elementAttribute);
					}
				}

				continue;
			}
			if (key.equals("_include")) {
				String[] outerValues = parameters.get(key);
				for (int j = 0; j < outerValues.length; j++) {
					String[] elementValues = outerValues[j].split(",");
					for (int i = 0; i < elementValues.length; i++) {
						String elementValue = elementValues[i];
						String[] segments = elementValue.split(":");
						if (segments.length != 2) {
							throw new FhirException(
									"Incorrect value for include must be in form:[TYPE]:[searchParam]", null);
						}
						SearchParameter sp = repo.getSearchParameterByTypeAndCode(typeSD, segments[1]);
						SearchContext ctx = SearchHelper.provideContext(typeSD, sp);
						ResultElement searchAttribute = qb.out(typeSD, ctx.path);
						query.include(searchAttribute);
					}
				}

				continue;
			}
			if (key.equals("_revinclude")) {
				String[] outerValues = parameters.get(key);
				for (int j = 0; j < outerValues.length; j++) {
					String[] elementValues = outerValues[j].split(",");
					for (int i = 0; i < elementValues.length; i++) {
						String elementValue = elementValues[i];
						String[] segments = elementValue.split(":");
						if (segments.length != 2) {
							throw new FhirException(
									"Incorrect value for include must be in form:[TYPE]:[searchParam]", null);
						}

						StructureDefinition typeSd = qb.sd(segments[0]);

						SearchParameter sp = repo.getSearchParameterByTypeAndCode(typeSd, segments[1]);
						SearchContext ctx = SearchHelper.provideContext(typeSd, sp);

						ResultElement searchAttribute = qb.out(typeSd, ctx.path);
						query.revinclude(searchAttribute);
					}
				}

				continue;
			}
			if (key.equals("_id")) {
				String[] outerValues = parameters.get(key);
				for (int j = 0; j < outerValues.length; j++) {
					String[] elementValues = outerValues[j].split(",");
					for (int i = 0; i < elementValues.length; i++) {
						String elementValue = elementValues[i];
						elementValue = Utils.checkUUID(elementValue);
						ResultElement elementAttribute = qb.out(typeSD, typeSD.getId() + ".id");
						expression = expression == null ? qb.eq(elementAttribute, qb.string(elementValue))
								: qb.and(expression, qb.eq(elementAttribute, qb.string(elementValue)));
					}
				}

				continue;
			}

			SearchParameter sp = repo.getSearchParameterByTypeAndCode(typeSD, key);

			if (sp != null) {
				if (isCatalog) {// && key.equals("category")) {
					Parameter param = new Parameter();
					param.name(key);
					StringJoiner stringJoiner = new StringJoiner(",");
					StringExpression strExpresion = new StringExpression();
					String[] outerValues = parameters.get(key);
					for (int j = 0; j < outerValues.length; j++) {
						stringJoiner.add(outerValues[j]);
					}
					strExpresion.value(stringJoiner.toString());
					param.value(strExpresion);
					query.addParameter(param);
					if (key.equals("category")) {
						continue;
					}
				}

				SearchTypeHandler handler = getSearchTypeHandler(sp.getType());

				handler.setQueryBuilder(qb);
				expression = handler.search(typeSD, expression, parameters.get(key), sp, key);

				if (expression != null) {
					expression.setKey(key);
				}
				Query innerQuery = handler.getInnerQuery();
				if (innerQuery != null) {
					query.join(qb.join(innerQuery.getResultDefinition(), innerQuery.getName() + ".id"));
				}
				Join join = handler.getJoin();
				if (join != null) {
					query.join(join);
				}
			}
		}
		if (expression != null) {
			query.filter(expression);
		}
		return query;
	}

	public Expression getExpression(String type, Map<String, String[]> parameters, MetaRepository repo)
			throws FhirException {
		QueryBuilder qb = new QueryBuilder();
		qb.setMetaRepository(repo);
		StructureDefinition typeSD = qb.sd(type);

		Set<String> keys = parameters.keySet();
		Expression expression = null;
		for (String key : keys) {
			SearchParameter sp = repo.getSearchParameterByTypeAndCode(typeSD, key);
			if (sp != null) {
				SearchTypeHandler handler = getSearchTypeHandler(sp.getType());
				handler.setQueryBuilder(qb);
				expression = handler.search(typeSD, expression, parameters.get(key), sp, key);
			}
		}
		return expression;
	}

	public SearchTypeHandler getSearchTypeHandler(String type) {
		switch (type) {
			case "string":
				return new SearchStringHandler();
			case "token":
				return new SearchTokenHandler();
			case "reference":
				return new SearchReferenceHandler();
			case "date":
			case "datetime":
				return new SearchDateHandler();
			case "quantity":
				return new SearchQuantityHandler();
			default:
				return null;
		}
	}
}
