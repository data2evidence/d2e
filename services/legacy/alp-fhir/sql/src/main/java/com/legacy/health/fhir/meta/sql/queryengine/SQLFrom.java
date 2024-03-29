package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLFrom implements SQLQueryElement {
	protected SQLBaseTable basetable;

	public SQLFrom table(SQLBaseTable basetable) {
		this.basetable = basetable;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues vals) throws FhirException {
		return " FROM " + basetable.getSQL(vals);
	}

	public SQLBaseTable getBasetable() {
		return basetable;
	}

	public void setBasetable(SQLBaseTable basetable) {
		this.basetable = basetable;
	}
}
