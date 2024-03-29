package com.legacy.health.fhir.meta.sql.queryengine;

import com.legacy.health.fhir.meta.FhirException;

public class SQLOrderBy implements SQLQueryElement {

	protected SQLResultColumn sortColumn;
	protected boolean descending = false;

	public SQLOrderBy sortColumn(SQLResultColumn sortColumn) {
		this.sortColumn = sortColumn;
		return this;
	}

	public SQLOrderBy descending() {
		this.descending = true;
		return this;
	}

	public SQLOrderBy ascending() {
		this.descending = false;
		return this;
	}

	@Override
	public String getSQL(PreparedStatementValues vals) throws FhirException {
		return sortColumn.getSQL(vals) + (descending ? " DESC" : " ASC");
	}

}
