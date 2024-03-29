package com.legacy.health.fhir.meta.queryengine;

import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class AbstractQueryElement implements QueryElement {

	protected QueryBuilder queryBuilder;
	protected static ObjectMapper mapper = new ObjectMapper();

	public QueryElement withQueryBuilder(QueryBuilder queryBuilder) {
		this.queryBuilder = queryBuilder;
		return this;
	}

}
