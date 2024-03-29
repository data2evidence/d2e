package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLJoin extends SQLExpression {

	protected SQLExpression tableExpression;
	protected SQLExpression joinExpression;

	public SQLJoin tableExpression(SQLExpression base) {
		this.tableExpression = base;
		return this;
	}

	public SQLJoin on(SQLExpression joinExpression) {
		this.joinExpression = joinExpression;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		if (this.label == null) {
			return " JOIN " + tableExpression.getSQL(val) + " ON " + joinExpression.getSQL(val);
		} else {
			return " JOIN (" + tableExpression.getSQL(val) + ")  "
					+ SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(this.label), '"') + " ON "
					+ joinExpression.getSQL(val);
		}

	}

	// TODO get Base should be replaced by getTableExpression
	public SQLBaseTable getBase() {
		return (SQLBaseTable) tableExpression;
	}

	public SQLExpression getTableExpression() {
		return tableExpression;
	}

	public void setBase(SQLExpression base) {
		this.tableExpression = base;
	}

	public SQLExpression getJoinExpression() {
		return joinExpression;
	}

	public void setJoinExpression(SQLExpression joinExpression) {
		this.joinExpression = joinExpression;
	}

	public SQLJoin table(SQLBaseTable base) {
		return this.tableExpression(base);
	}
}
