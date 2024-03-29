package com.legacy.health.fhir.executor;

import com.legacy.health.fhir.meta.queryengine.Join;
import com.legacy.health.fhir.meta.queryengine.Query;
import com.legacy.health.fhir.meta.queryengine.QueryBuilder;

public abstract class AbstractSearchTypeHandler implements SearchTypeHandler {
	protected QueryBuilder qb = new QueryBuilder();

	@Override
	public void setQueryBuilder(QueryBuilder qb) {
		this.qb = qb;
	}

	public Query getInnerQuery() {
		return null;
	}

	public Join getJoin() {
		return null;
	}
}
