package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLInnerQuery extends SQLBaseTable {

	protected SQLQuery query;

	public SQLInnerQuery query(SQLQuery query) {
		this.query = query;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues val) throws FhirException {
		String ret = "( " + query.getSQL(val);
		ret += alias != null ? (" " + SQLUtils.ensureQuoting(SQLUtils.assertValidSQLIdentifier(alias), '"') + " ")
				: "";
		ret += ")";
		return ret;
	}
}
