package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLUnaryFunction extends SQLExpression {

	protected String functionName;
	protected SQLExpression expression;

	public SQLUnaryFunction name(String name) {
		this.functionName = name;
		return this;
	}

	public String name() {
		return functionName;
	}

	public SQLUnaryFunction parameter(SQLExpression expression) {
		this.expression = expression;
		return this;
	}

	public SQLExpression parameter() {
		return expression;
	}

	@Override
	public String getSQL(PreparedStatementValues prepValues) throws FhirException {
		String lbl = label != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(label), '"'))
				: " ";
		return this.functionName + "(" + expression.getSQL(prepValues) + ") " + lbl;
	}
}