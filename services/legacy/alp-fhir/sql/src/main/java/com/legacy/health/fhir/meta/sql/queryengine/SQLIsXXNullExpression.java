package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLIsXXNullExpression extends SQLExpression {

	SQLExpression expression;
	boolean isNot = false;

	public SQLIsXXNullExpression expression(SQLExpression expression) {
		this.expression = expression;
		return this;
	}

	public SQLIsXXNullExpression not() {
		isNot = true;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		return "(" + expression.getSQL(val) + " IS " + (isNot ? "NOT " : "") + "NULL )";
	}

	public SQLExpression getExpression() {
		return expression;
	}
}
