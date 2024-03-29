package com.legacy.health.fhir.executor;

import com.legacy.health.fhir.meta.FhirException;
import com.legacy.health.fhir.meta.entity.SearchParameter;
import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.queryengine.Expression;
import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;

public interface SearchTypeHandler {

	void setQueryBuilder(QueryBuilder qb);

	/**
	 * 
	 * @param typeSD
	 * @param expression - the Expression which results in the filter statement
	 * @param values
	 * @param sp
	 * @return
	 * @throws FhirException
	 */
	Expression search(
			StructureDefinition typeSD, Expression expression, String[] values, SearchParameter sp, String code)
			throws FhirException;

	/**
	 * Shall only be called after execution of search
	 * 
	 * @return
	 */
	Query getInnerQuery();

	Join getJoin();
}
