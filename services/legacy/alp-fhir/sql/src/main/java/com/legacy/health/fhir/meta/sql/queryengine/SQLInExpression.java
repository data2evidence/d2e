package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLInExpression extends SQLExpression {

	SQLExpression leftExpression;
	SQLExpression list;

	public SQLInExpression left(SQLExpression left) {
		this.leftExpression = left;
		return this;
	}

	public SQLInExpression list(SQLExpression list) {
		this.list = list;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues prepValues) throws FhirException {
		return "(" + leftExpression.getSQL(prepValues) + " IN (" + list.getSQL(prepValues) + "))";
	}

}
