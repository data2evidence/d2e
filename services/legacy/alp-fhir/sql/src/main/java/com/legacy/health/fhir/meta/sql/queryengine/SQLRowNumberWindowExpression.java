package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLRowNumberWindowExpression extends SQLExpression {
	SQLExpression partitionExpression;
	SQLExpression orderByExpression;
	boolean desc;

	public SQLRowNumberWindowExpression partition(SQLExpression partition) {
		this.partitionExpression = partition;
		return this;
	}

	public SQLRowNumberWindowExpression orderby(SQLExpression orderby) {
		this.orderByExpression = orderby;
		return this;
	}

	public SQLRowNumberWindowExpression desc(boolean desc) {
		this.desc = desc;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues prepValues) throws FhirException {
		String order = desc ? " desc" : " asc";
		String lbl = label != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(label), '"'))
				: " ";
		return "( ROW_NUMBER() over (partition by " + partitionExpression.getSQL(prepValues) + " order by "
				+ orderByExpression.getSQL(prepValues) + order + "))" + lbl + " ";
	}
}
