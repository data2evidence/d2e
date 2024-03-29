package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLTimeBetweenExpression extends SQLExpression {

	protected SQLExpression leftExpression;
	protected SQLExpression rightExpression;
	protected String precission;

	public SQLTimeBetweenExpression left(SQLExpression left) {
		this.leftExpression = left;
		return this;
	}

	public SQLTimeBetweenExpression right(SQLExpression right) {
		this.rightExpression = right;
		return this;
	}

	public SQLTimeBetweenExpression precission(String precission) {
		this.precission = precission;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues vals) throws FhirException {
		if (precission.equals("YEAR")) {
			// String sql = " date_part('year',age(" +rightExpression.getSQL(vals)+" , "+
			// leftExpression.getSQL(vals)+"))";
			String sql = " DATEDIFF('yy'," + leftExpression.getSQL(vals) + " , " + rightExpression.getSQL(vals)
					+ ")) - 1 ";
			return sql;
		}
		return null;
	}

}
